from flask import Blueprint, request, jsonify
from API.extensions import mail  
from backend.Authentication.signin import Authentication
from backend.Authentication.password_reset.passwordReset import EmailSender
from backend.Dashboard.DashBoard import DashBoard


auth_bp = Blueprint('auth', __name__, url_prefix='/api')

# Load logo once at import time
import os
_logo_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    '../backend/Authentication/password_reset/netra.png'
)
with open(_logo_path, 'rb') as f:
    _logo_data = f.read()


@auth_bp.route('/get_credentials', methods=['POST'])
def get_credentials():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'code': 400, 'message': 'Missing username or password'}), 400
    inst = Authentication()
    return inst.sign_in(data['username'], data['password'])


@auth_bp.route('/insert_user', methods=['POST'])
def insert_new_user():
    data = request.json
    required = ('username', 'password', 'level')
    if not data or not all(k in data for k in required):
        return jsonify({'code': 400, 'message': 'Missing required fields'}), 400
    inst = Authentication()
    result = inst.sign_up(data['username'], data['password'], data['level'])
    return jsonify(result)


@auth_bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    if not data or 'username' not in data:
        return jsonify({'code': 400, 'message': 'Missing username'}), 400
    inst = EmailSender(mail)
    return inst.send_notification_email(data['username'], _logo_data)


@auth_bp.route('/get_users', methods=['POST'])
def get_users():
    data = request.json
    inst = DashBoard()
    return inst.fetch_users(data)


@auth_bp.route('/update_user', methods=['PUT'])
def update_user():
    data = request.json
    inst = DashBoard()
    return inst.update_user(data)


@auth_bp.route('/delete_user', methods=['POST'])
def delete_user():
    data = request.json
    inst = DashBoard()
    return inst.delete_user(data)
