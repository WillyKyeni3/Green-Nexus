# server/app/routes/marketplace.py
from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
import re
import urllib.parse

marketplace_bp = Blueprint('marketplace', __name__)

@marketplace_bp.route('/api/chat', methods=['POST'])
def ai_chat():
    """AI Marketplace Chat - Search eco-friendly products on web"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').lower().strip()
        
        if not user_message:
            return jsonify({
                'response': 'Hello! Ask me about eco-friendly products. Example: "best sustainable water bottles 2025"'
            })
        
        # Extract eco-product keywords
        eco_patterns = [
            r'(best|top|recommend)\s+(eco-friendly|sustainable|green|organic)\s+(.+?)(?:\s+(?:for|in)\s+|\s+2025|\s*$)',
            r'(?:find|show)\s+(eco-friendly|sustainable|green)\s+(.+?)(?:\s+2025|\s*$)',
            r'(eco|green|sustainable)\s+(.+?)(?:\s+bottles|\s+bags|\s+clothes|\s+2025|\s*$)'
        ]
        
        keywords = None
        for pattern in eco_patterns:
            matches = re.findall(pattern, user_message)
            if matches:
                keywords = matches[0]
                break
        
        if not keywords:
            return jsonify({
                'response': 'I specialize in eco-friendly products! Try: "Recommend sustainable water bottles" or "Best green cleaning products 2025"'
            })
        
        # Build search query
        if len(keywords) == 4:
            action, eco_type, product, _ = keywords
            query = f"{action} {eco_type} {product} 2025"
        else:
            query = f"best {keywords[1]} {keywords[2]} 2025"
        
        # Real web search via DuckDuckGo (works without API key)
        search_query = urllib.parse.quote(query)
        search_url = f"https://html.duckduckgo.com/html/?q={search_query}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract top 3 results
        results = []
        result_elements = soup.find_all('div', class_='result__body')[:3]
        
        for result in result_elements:
            title_elem = result.find('a', class_='result__a')
            snippet_elem = result.find('a', class_='result__snippet')
            link_elem = result.find('a', class_='result__url')
            
            if title_elem:
                title = title_elem.get_text().strip()
                snippet = snippet_elem.get_text().strip() if snippet_elem else "Eco-friendly product with sustainable materials"
                link = link_elem.get_text().strip() if link_elem else "View product"
                
                results.append({
                    'title': title,
                    'description': snippet,
                    'link': link
                })
        
        # Format beautiful AI response
        ai_response = f"🌿 **Eco-Friendly {keywords[-1].title()} Recommendations (2025)**\n\n"
        
        if results:
            for i, item in enumerate(results, 1):
                ai_response += f"{i}. **{item['title']}**\n"
                ai_response += f"   {item['description']}\n"
                ai_response += f"   🔗 {item['link']}\n\n"
        else:
            ai_response += "No specific results found, but look for:\n"
            ai_response += f"- Products made from **recycled materials**\n"
            ai_response += f"- **BPA-free** & **zero-waste** packaging\n"
            ai_response += f"- Brands with **carbon-neutral** shipping\n\n"
        
        ai_response += "💚 **Pro Tip**: Choose products with 3rd-party certifications (B Corp, Fair Trade) for maximum impact!"
        
        return jsonify({'response': ai_response})
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({
            'response': '🔍 Search temporarily unavailable. Try: "best eco-friendly water bottles" for manual suggestions.'
        }), 500

# Export blueprint
def get_marketplace_blueprint():
    return marketplace_bp