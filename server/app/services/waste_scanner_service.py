import os
import base64
from datetime import datetime
from app import db
from app.models.waste_item import WasteItem
from openai import OpenAI
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import uuid

# Load environment variables
load_dotenv()

def encode_image_to_base64(image_path):
    """Convert image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def analyze_waste_image(image_path):
    """Analyze waste image using OpenAI Vision API"""
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Encode image to base64
        base64_image = encode_image_to_base64(image_path)
        
        # Call OpenAI API with updated model name
        response = client.chat.completions.create(
            model="gpt-4o",  # Updated to use gpt-4o which supports vision
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Analyze this image and provide information about the waste item shown. Respond in the following format:
                            
WASTE_TYPE: [type of waste - plastic, paper, glass, metal, organic, etc.]
RECYCLABILITY: [Recyclable/Non-recyclable/Conditionally recyclable]
RECYCLING_INSTRUCTIONS: [Brief instructions on how to properly dispose/recycle]
ENVIRONMENTAL_IMPACT: [Brief note on environmental impact]
MATERIAL_COMPOSITION: [Main materials in the item]"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Error analyzing image: {str(e)}")
        raise e

def extract_ai_response_fields(ai_response):
    """Extract individual fields from the AI response string"""
    lines = ai_response.split('\n')
    fields = {}
    
    for line in lines:
        if line.startswith('WASTE_TYPE:'):
            fields['waste_type'] = line.replace('WASTE_TYPE:', '').strip()
        elif line.startswith('RECYCLABILITY:'):
            fields['recyclability'] = line.replace('RECYCLABILITY:', '').strip()
        elif line.startswith('RECYCLING_INSTRUCTIONS:'):
            fields['recycling_instructions'] = line.replace('RECYCLING_INSTRUCTIONS:', '').strip()
        elif line.startswith('ENVIRONMENTAL_IMPACT:'):
            fields['environmental_impact'] = line.replace('ENVIRONMENTAL_IMPACT:', '').strip()
        elif line.startswith('MATERIAL_COMPOSITION:'):
            fields['material_composition'] = line.replace('MATERIAL_COMPOSITION:', '').strip()
    
    return fields

def save_waste_analysis_result(filename, filepath, original_name=None, user_id=None):
    """Save the uploaded image info and AI analysis to the database"""
    try:
        # Analyze the image using AI
        ai_response = analyze_waste_image(filepath)
        
        # Extract individual fields from AI response
        fields = extract_ai_response_fields(ai_response)
        
        # Create a new WasteItem instance
        waste_item = WasteItem(
            filename=filename,
            filepath=filepath,
            original_name=original_name,
            waste_type=fields.get('waste_type', ''),
            recyclability=fields.get('recyclability', ''),
            recycling_instructions=fields.get('recycling_instructions', ''),
            environmental_impact=fields.get('environmental_impact', ''),
            material_composition=fields.get('material_composition', ''),
            user_id=user_id
        )
        
        # Add to database
        db.session.add(waste_item)
        db.session.commit()
        
        return waste_item.to_dict()
        
    except Exception as e:
        print(f"Error saving waste analysis result: {str(e)}")
        db.session.rollback()
        raise e

def get_waste_analysis_by_id(waste_item_id):
    """Retrieve a specific waste analysis result by ID"""
    try:
        waste_item = WasteItem.query.get(waste_item_id)
        if waste_item:
            return waste_item.to_dict()
        return None
    except Exception as e:
        print(f"Error retrieving waste analysis: {str(e)}")
        return None

def get_all_waste_analyses():
    """Retrieve all waste analysis results"""
    try:
        waste_items = WasteItem.query.all()
        return [item.to_dict() for item in waste_items]
    except Exception as e:
        print(f"Error retrieving waste analyses: {str(e)}")
        return []