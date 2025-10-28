import os
import base64
from openai import OpenAI
from PIL import Image
import io
from dotenv import load_dotenv  # Add this import

# Load environment variables from .env file
load_dotenv()

def encode_image_to_base64(image_path):
    """Convert image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def test_waste_analysis(image_path):
    """Test function to analyze waste image using OpenAI Vision API"""
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
        return None

def test_with_sample_image():
    """Test function - now using the correct path"""
    # Use the correct path to your image
    test_image_path = "uploads/Bottle.png"  # This is correct since you're running from server directory
    
    print(f"Testing OpenAI waste analysis with image: {test_image_path}")
    
    # Check if file exists first
    if not os.path.exists(test_image_path):
        print(f"Error: Image file does not exist at {test_image_path}")
        return None
    
    result = test_waste_analysis(test_image_path)
    
    if result:
        print("Analysis Result:")
        print(result)
        return result
    else:
        print("Failed to analyze image")
        return None

if __name__ == "__main__":
    # Check if API key is available
    openai_key = os.getenv('OPENAI_API_KEY')
    if not openai_key:
        print("Error: OPENAI_API_KEY environment variable not found")
        print("Create a .env file in the server directory with your API key")
    else:
        print("OpenAI key found, testing image analysis...")
        test_with_sample_image()