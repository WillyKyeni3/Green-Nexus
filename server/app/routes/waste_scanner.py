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
    """Handle image upload and AI analysis"""
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
    """Get a specific analysis result by ID"""
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
    """Get all analysis results"""
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

@waste_scanner_bp.route('/test', methods=['POST'])
def test_endpoint():
    """Test endpoint to verify the route is working"""
    return jsonify({
        'success': True,
        'message': 'Waste scanner route is working!'
    }), 200