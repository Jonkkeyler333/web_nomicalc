from flask import Blueprint, request , jsonify
from backend.models import User , Employee
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from backend.extensions import db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login-user', methods=['POST'])
def login_user():
    data=request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    user=User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if not check_password_hash(user.password,data['password']):
        return jsonify({'error':'Invalid password'}), 401
    access_token=create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/login-employee', methods=['POST'])
def login_employee():
    data=request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    employee=Employee.query.filter_by(email=data['email']).first()
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    if not check_password_hash(employee.password,data['password']):
        return jsonify({'error':'Invalid password'}), 401
    access_token=create_access_token(identity=employee.id)
    return jsonify({'access_token': access_token}), 200