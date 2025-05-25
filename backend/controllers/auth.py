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
        # access_token = create_access_token(identity=user.id,additional_claims={"type": "user"})
        # return jsonify({'access_token': access_token,'user_type': 'user','user': user.to_dict()}), 200
        access_token = create_access_token(identity={"id": user.id, "type": "user"})
        return jsonify({'access_token': access_token, 'user_type': 'user','user':user.to_dict()}), 200
    
    # If not a user, try as an employee
    employee = Employee.query.filter_by(email=data['email']).first()
    if employee and check_password_hash(employee.password, data['password']):
        access_token = create_access_token(identity={"id": employee.id, "type": "employee"})
        return jsonify({'access_token': access_token, 'user_type': 'employee','user':employee.to_dict()}), 200
        # access_token = create_access_token(identity=employee.id,additional_claims={"type": "employee"})
        # return jsonify({'access_token': access_token,'user_type': 'employee','user': employee.to_dict()}), 200
    
    # If neither, return error
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/profile',methods=['GET'])
@jwt_required()
def get_profile():
    # identity=get_jwt_identity()
    # current_id = get_jwt_identity()  # será “2” o 2
    # claims     = get_jwt()           # dict con {"type": "user", ...}
    # user_type  = claims.get("type")
    identity= get_jwt_identity()
    user_type = identity['type']
    current_id = identity['id']
    # print(identity)
    # if user_type == 'user':
    #     user = User.query.get(current_id)
    #     if not user:
    #         return jsonify({'error': 'User not found'}), 404
    #     return jsonify(user.to_dict()),200
    # else:
    #     employee=Employee.query.get(current_id)
    #     if not employee:
    #         return jsonify({'error': 'Employee not found'}), 404
    #     return jsonify(employee.to_dict()),200
    if user_type == 'user':
        user = User.query.get(current_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(user.to_dict()),200
    else:
        employee=Employee.query.get(current_id)
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        return jsonify(employee.to_dict()),200