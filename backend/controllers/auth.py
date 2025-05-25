from flask import Blueprint, request , jsonify
from backend.models import User , Employee
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity,get_jwt
from backend.extensions import db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Try to authenticate as a user first
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        additional_claims = {"type":"user"}
        access_token = create_access_token(identity=str(user.id),additional_claims=additional_claims)
        return jsonify({'access_token': access_token, 'user_type': 'user','user':user.to_dict()}), 200
    
    # If not a user, try as an employee
    employee = Employee.query.filter_by(email=data['email']).first()
    if employee and check_password_hash(employee.password, data['password']):
        additional_claims = {"type":"employee"}
        access_token = create_access_token(identity=str(employee.id),additional_claims=additional_claims)
        return jsonify({'access_token': access_token, 'user_type': 'employee','user':employee.to_dict()}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/profile',methods=['GET'])
@jwt_required()
def get_profile():
    # 1. La identidad (sub) es sólo el user.id en string:
    identity = get_jwt_identity()           # ej. "42"
    # 2. Los claims adicionales van aparte:
    claims = get_jwt()                      # ej. {"type":"user", "company_id": 7, ...}
    user_type = claims.get("type")          # "user" o "employee"
    user_id   = int(identity)               # convertimos a entero para query
    if user_type == 'user':
        user = User.query.get(user_id)
    else:
        user = Employee.query.get(user_id)
    if not user:
        return jsonify({'error': f'{user_type} not found'}), 404
    # Si quieres devolver el company_id en la respuesta, lo tienes en claims:
    result = user.to_dict()
    # result['company_id'] = claims.get('company_id')
    return jsonify(result), 200