# server/app/routes/waste_scanner.py
import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.services.waste_scanner_service import save_waste_analysis_result, get_waste_analysis_by_id, get_all_waste_analyses
from app.models.waste_item import WasteItem
import uuid

waste_scanner_bp = Blueprint('waste_scanner', __name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@waste_scanner_bp.route('/upload', methods=['POST'])
def upload_image():
    """
    Upload Waste Image
    Upload an image of waste for AI-powered analysis and classification
    ---
    tags:
      - Waste Scanner
    consumes:
      - multipart/form-data
    parameters:
      - in: formData
        name: image
        type: file
        required: true
        description: Image file of waste item (png, jpg, jpeg, gif, webp)
      - in: formData
        name: user_id
        type: integer
        required: false
        description: Optional user ID to associate with the scan
    responses:
      200:
        description: Image analyzed successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Image analyzed successfully"
            data:
              type: object
              properties:
                id:
                  type: integer
                  example: 1
                waste_type:
                  type: string
                  example: "Plastic Bottle"
                recyclable:
                  type: boolean
                  example: true
                disposal_instructions:
                  type: string
                  example: "Rinse and place in recycling bin"
                environmental_impact:
                  type: string
                  example: "High - Takes 450 years to decompose"
                filename:
                  type: string
                  example: "abc123_bottle.jpg"
                created_at:
                  type: string
                  format: date-time
      400:
        description: Bad request - no file or invalid file type
        schema:
          type: object
          properties:
            error:
              type: string
              example: "No image file provided"
      500:
        description: Server error
    """
    try:
        # Check if the post request has the file part
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        # If user does not select file, browser submits empty part without filename
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file and allowed_file(file.filename):
            # Secure the filename
            original_filename = secure_filename(file.filename)
            # Generate unique filename to prevent conflicts
            unique_filename = f"{str(uuid.uuid4())}_{original_filename}"
            
            # Create upload directory if it doesn't exist
            upload_dir = os.path.join(current_app.root_path, '..', UPLOAD_FOLDER)
            os.makedirs(upload_dir, exist_ok=True)
            
            # Save the file
            filepath = os.path.join(upload_dir, unique_filename)
            file.save(filepath)
            
            # Get user_id from request if available (optional)
            user_id = request.form.get('user_id', None)
            if user_id:
                user_id = int(user_id)
            
            # Process the image with AI and save to database
            result = save_waste_analysis_result(
                filename=unique_filename,
                filepath=filepath,
                original_name=original_filename,
                user_id=user_id
            )
            
            # Return the analysis result
            return jsonify({
                'success': True,
                'message': 'Image analyzed successfully',
                'data': result
            }), 200
        else:
            return jsonify({'error': 'Invalid file type. Allowed types: png, jpg, jpeg, gif, webp'}), 400
            
    except Exception as e:
        print(f"Error in upload_image: {str(e)}")
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@waste_scanner_bp.route('/results/<int:waste_item_id>', methods=['GET'])
def get_analysis_result(waste_item_id):
    """
    Get Analysis Result
    Retrieve a specific waste analysis result by ID
    ---
    tags:
      - Waste Scanner
    parameters:
      - in: path
        name: waste_item_id
        required: true
        type: integer
        description: ID of the waste analysis result
    responses:
      200:
        description: Analysis result retrieved successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: object
              properties:
                id:
                  type: integer
                waste_type:
                  type: string
                recyclable:
                  type: boolean
                disposal_instructions:
                  type: string
                environmental_impact:
                  type: string
                filename:
                  type: string
                created_at:
                  type: string
                  format: date-time
      404:
        description: Analysis result not found
      500:
        description: Server error
    """
    try:
        result = get_waste_analysis_by_id(waste_item_id)
        if result:
            return jsonify({
                'success': True,
                'data': result
            }), 200
        else:
            return jsonify({'error': 'Analysis result not found'}), 404
    except Exception as e:
        print(f"Error in get_analysis_result: {str(e)}")
        return jsonify({'error': f'Failed to retrieve result: {str(e)}'}), 500

@waste_scanner_bp.route('/results', methods=['GET'])
def get_all_analysis_results():
    """
    Get All Analysis Results
    Retrieve all waste analysis results
    ---
    tags:
      - Waste Scanner
    responses:
      200:
        description: All analysis results retrieved successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  waste_type:
                    type: string
                  recyclable:
                    type: boolean
                  disposal_instructions:
                    type: string
                  environmental_impact:
                    type: string
                  filename:
                    type: string
                  created_at:
                    type: string
                    format: date-time
            count:
              type: integer
              example: 15
              description: Total number of results
      500:
        description: Server error
    """
    try:
        results = get_all_waste_analyses()
        return jsonify({
            'success': True,
            'data': results,
            'count': len(results)
        }), 200
    except Exception as e:
        print(f"Error in get_all_analysis_results: {str(e)}")
        return jsonify({'error': f'Failed to retrieve results: {str(e)}'}), 500

@waste_scanner_bp.route('/recent', methods=['GET'])
def get_recently_scanned():
    """
    Get Recently Scanned Items
    Retrieve the 6 most recently analyzed waste items
    ---
    tags:
      - Waste Scanner
    responses:
      200:
        description: Recent scans retrieved successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  waste_type:
                    type: string
                    example: "Plastic Bottle"
                  recyclable:
                    type: boolean
                    example: true
                  disposal_instructions:
                    type: string
                  environmental_impact:
                    type: string
                  filename:
                    type: string
                  created_at:
                    type: string
                    format: date-time
            count:
              type: integer
              example: 6
              description: Number of recent items (max 6)
      500:
        description: Server error
    """
    try:
        # Query the database for the 6 most recent WasteItem entries
        recent_items = WasteItem.query.order_by(WasteItem.created_at.desc()).limit(6).all()
        
        # Convert the results to dictionaries
        recent_items_data = [item.to_dict() for item in recent_items]
        
        return jsonify({
            'success': True,
            'data': recent_items_data,
            'count': len(recent_items_data)
        }), 200
    except Exception as e:
        print(f"Error in get_recently_scanned: {str(e)}")
        return jsonify({'error': f'Failed to retrieve recent scans: {str(e)}'}), 500

@waste_scanner_bp.route('/test', methods=['POST'])
def test_endpoint():
    """
    Test Endpoint
    Verify that the waste scanner route is working
    ---
    tags:
      - Waste Scanner
    responses:
      200:
        description: Test successful
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Waste scanner route is working!"
    """
    return jsonify({
        'success': True,
        'message': 'Waste scanner route is working!'
    }), 200