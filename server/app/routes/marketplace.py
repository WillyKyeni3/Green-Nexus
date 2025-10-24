from flask import Blueprint, request, jsonify
import os
from openai import OpenAI
import re

marketplace_bp = Blueprint('marketplace', __name__, url_prefix='/api')

# OpenAI client (uses key from .env)
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@marketplace_bp.route('/chat', methods=['POST'])
def ai_chat():
    try:
        # Debug: Print request details
        print("\n" + "="*50)
        print("🌿 MARKETPLACE CHAT REQUEST")
        print("="*50)
        print(f"📍 Request method: {request.method}")
        print(f"📍 Content-Type: {request.headers.get('Content-Type')}")
        
        # Check if data exists
        if not request.is_json:
            print("❌ ERROR: Request is not JSON")
            return jsonify({
                'error': 'Request must be JSON',
                'response': 'Please send JSON data'
            }), 400
        
        data = request.get_json()
        print(f"📍 Request data: {data}")
        
        if not data:
            print("❌ ERROR: No JSON data received")
            return jsonify({
                'error': 'No JSON data',
                'response': 'Please send a message'
            }), 400
        
        user_message = data.get('message', '').lower().strip()
        print(f"💬 User message: '{user_message}'")
        
        if not user_message:
            print("⚠️  Empty message received")
            return jsonify({
                'response': 'Hello! Ask about eco-friendly products. Example: "best sustainable water bottles 2025"'
            }), 200
        
        # Check if OpenAI API key exists
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            print("❌ ERROR: OPENAI_API_KEY not set in environment")
            return jsonify({
                'error': 'API key not configured',
                'response': 'Server configuration error. Contact admin.'
            }), 500
        
        print(f"✅ OpenAI API key found: {api_key[:10]}...")
        
        # Simple keyword extraction for context
        keywords = re.findall(
            r'(best|top|recommend)\s+(eco-friendly|sustainable|green|organic)\s+(.+?)(?:\s+2025|$)', 
            user_message
        )
        
        context = ""
        if keywords:
            eco_type, product = keywords[0][1], keywords[0][2]
            context = f"User is asking for {eco_type} {product} recommendations. Focus on 2025 trends, sustainability certifications (B Corp, Fair Trade), recycled materials, and eco-impact."
            print(f"🎯 Extracted context: {context[:80]}...")
        else:
            context = "User query about eco-friendly products. Provide 3-5 recommendations with pros/cons, prices, and where to buy. Emphasize sustainability."
            print(f"📝 Using default context")
        
        print("🚀 Calling OpenAI API (gpt-4o-mini)...")
        
        # OpenAI GPT-4o-mini call with Kenya theme and Kshs pricing
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Cheap & fast for this use case
            messages=[
                {
                    "role": "system",
                    "content": """You are Green-Nexus AI, an eco-expert assistant based in Kenya specializing in sustainable products available in the Kenyan market.

IMPORTANT: Use PLAIN TEXT ONLY. NO markdown, NO asterisks, NO hashes, NO special formatting symbols.

Format your response exactly like this with line breaks between sections:

Hello! 🌿 [Brief greeting about sustainable products in Kenya]

SUMMARY
[2-3 sentences explaining the product category and its environmental benefits in the Kenyan context]

TOP 3 RECOMMENDATIONS

1. Product Name
Key Features: [List 2-3 key features]
Eco-Score: X/10
Price Range: Kshs X,XXX - Kshs X,XXX
Where to Buy: [List 2-3 Kenyan locations/shops]

2. Product Name
Key Features: [List 2-3 key features]
Eco-Score: X/10
Price Range: Kshs X,XXX - Kshs X,XXX
Where to Buy: [List 2-3 Kenyan locations/shops]

3. Product Name
Key Features: [List 2-3 key features]
Eco-Score: X/10
Price Range: Kshs X,XXX - Kshs X,XXX
Where to Buy: [List 2-3 Kenyan locations/shops]

PRO TIP
[1-2 sentences with actionable advice for Kenyans. Mention certifications like Fair Trade, USDA Organic, B Corp. Focus on local and sustainable choices available in Kenya]

Rules:
- ALWAYS use Kenyan Shilling (Kshs) for prices
- ALWAYS recommend products available in Kenya (local shops, online stores, markets)
- Do NOT use asterisks (*) for bold or emphasis
- Do NOT use hashes (#) for headers
- Do NOT use underscores (_)
- Do NOT use backticks (`)
- Do NOT use any markdown symbols
- Use plain text only with line breaks for formatting
- Use emojis sparingly (🌿💚♻️🇰🇪)
- Keep text clear and readable
- Suggest Kenyan retailers like Jumia, Carrefour, local eco-shops, markets
- Consider local context and African alternatives"""
                },
                {
                    "role": "user",
                    "content": f"{context}\n\nUser query: {user_message}"
                }
            ],
            max_tokens=800,
            temperature=0.7  # Balanced creativity
        )
        
        ai_response = response.choices[0].message.content.strip()
        print(f"✅ AI Response received: {ai_response[:100]}...")
        print("="*50)
        print("✨ REQUEST SUCCESSFUL\n")
        
        return jsonify({'response': ai_response}), 200
    
    except Exception as e:
        error_msg = str(e)
        print("\n" + "="*50)
        print("❌ ERROR OCCURRED")
        print("="*50)
        print(f"🔴 Error type: {type(e).__name__}")
        print(f"🔴 Error message: {error_msg}")
        print(f"🔴 Full error: {repr(e)}")
        print("="*50 + "\n")
        
        # Return helpful error message
        return jsonify({
            'error': error_msg,
            'response': 'AI is taking a green break! Try again or ask: "Recommend eco-friendly water bottles".'
        }), 500


# Health check endpoint
@marketplace_bp.route('/chat/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'marketplace',
        'openai_configured': bool(os.getenv('OPENAI_API_KEY'))
    }), 200