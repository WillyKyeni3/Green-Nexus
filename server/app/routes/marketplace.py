from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
import re
import urllib.parse

marketplace_bp = Blueprint('marketplace', __name__)  # Renamed to _bp

@marketplace_bp.route('/api/chat', methods=['POST'])
def ai_chat():
    # ... (your existing function code remains here) ...
    try:
        data = request.get_json()
        user_message = data.get('message', '').lower().strip()
        
        if not user_message:
            return jsonify({'response': 'Hello! Ask about eco-friendly products.'})
        
        keywords = re.findall(r'(best|top|recommend)\s+(eco-friendly|sustainable|green)\s+(.+?)(?:\s+2025|$)', user_message)
        
        if not keywords:
            return jsonify({'response': 'Try: "best eco-friendly water bottles"'})
        
        query = f"best {keywords[0][1]} {keywords[0][2]} 2025"
        
        search_query = urllib.parse.quote(query)
        search_url = f"https://html.duckduckgo.com/html/?q={search_query}"
        
        headers = {'User-Agent': 'Mozilla/5.0'}
        
        response = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        results = []
        for result in soup.find_all('div', class_='result__body')[:3]:
            title = result.find('a', class_='result__a').text if result.find('a', class_='result__a') else 'N/A'
            snippet = result.find('a', class_='result__snippet').text if result.find('a', class_='result__snippet') else 'N/A'
            link = result.find('a', class_='result__url').get('href') if result.find('a', class_='result__url') else 'N/A'
            
            results.append({
                'title': title,
                'description': snippet,
                'link': link
            })
        
        ai_response = f"🌿 **Eco-Friendly {keywords[0][2].title()} (2025)**\n\n"
        for i, item in enumerate(results, 1):
            ai_response += f"{i}. **{item['title']}** - {item['description']}\n🔗 {item['link']}\n\n"
        
        ai_response += "💚 Choose recycled materials!"
        
        return jsonify({'response': ai_response})
    
    except Exception as e:
        return jsonify({'response': 'Error: Try again!'}), 500