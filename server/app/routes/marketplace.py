from flask import Blueprint, request, jsonify
import os
from openai import OpenAI
import re

marketplace_bp = Blueprint('marketplace', __name__)

# OpenAI client (uses key from .env)
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@marketplace_bp.route('/api/chat', methods=['POST'])
def ai_chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '').lower().strip()
        
        if not user_message:
            return jsonify({'response': 'Hello! Ask about eco-friendly products. Example: "best sustainable water bottles 2025"'})
        
        # Simple keyword extraction for context
        keywords = re.findall(r'(best|top|recommend)\s+(eco-friendly|sustainable|green|organic)\s+(.+?)(?:\s+2025|$)', user_message)
        
        context = ""
        if keywords:
            eco_type, product = keywords[0][1], keywords[0][2]
            context = f"User is asking for {eco_type} {product} recommendations. Focus on 2025 trends, sustainability certifications (B Corp, Fair Trade), recycled materials, and eco-impact."
        else:
            context = "User query about eco-friendly products. Provide 3-5 recommendations with pros/cons, prices, and where to buy. Emphasize sustainability."
        
        # OpenAI GPT-4o-mini call
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Cheap & fast for this use case
            messages=[
                {
                    "role": "system",
                    "content": "You are Green-Nexus AI, an eco-expert assistant. Respond helpfully about sustainable products. Structure responses as: 1. Summary, 2. Top 3 recommendations (name, key features, eco-score 1-10, price range), 3. Pro tip. Keep friendly & concise. Use emojis 🌿💚."
                },
                {
                    "role": "user",
                    "content": f"{context}\n\nUser query: {user_message}"
                }
            ],
            max_tokens=400,
            temperature=0.7  # Balanced creativity
        )
        
        ai_response = response.choices[0].message.content.strip()
        
        return jsonify({'response': ai_response})
    
    except Exception as e:
        print(f"OpenAI error: {str(e)}")
        return jsonify({'response': 'AI is taking a green break! Try again or ask: "Recommend eco-friendly water bottles".'}), 500
