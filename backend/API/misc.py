from flask import Blueprint, jsonify, request

misc_bp = Blueprint('misc', __name__, url_prefix='/api')


@misc_bp.route('/home')
def home():
    return jsonify('Hello, This is new. We have connected ports!!')




@misc_bp.route('/add_data', methods=['POST'])
def add_data():
    try:
        data = request.get_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
