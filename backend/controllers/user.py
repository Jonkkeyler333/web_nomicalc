from flask import Blueprint, request, jsonify
from backend.models import User,Company,Role
from backend.extensions import db

user_bp=Blueprint('user',__name__,url_prefix='/api/user')

@user_bp.route('/', methods=['GET'])
def get_users():
    if request.args.get('name'):
        name = request.args.get('name')
        users = User.query.filter(User.name.ilike(f'%{name}%')).all()
        if not users:
            return jsonify({'error': 'No users found'}), 404
        return jsonify([user.to_dict() for user in users]), 200
    else:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@user_bp.route('/', methods=['POST'])
def create_user():
    try :
        data = request.get_json()
        if Company.query.get(data['company_id']) is None:
            return jsonify({'error': 'Company not found'}), 404
        if Role.query.get(data['role_id']) is None:
            return jsonify({'error': 'Role not found'}), 404
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=data['password'],
            is_active=data.get('is_active', True),
            company_id=data['company_id'],
            role_id=data['role_id']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'User with this email already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@user_bp.route('/<int:user_id>',methods=['DELETE'])
def delete_user(user_id):
    method_delete=request.args.get('soft')
    if method_delete == 'soft':
        user = User.query.get_or_404(user_id)
        user.is_active = False
        db.session.commit()
        return jsonify({'message': 'User deactivated successfully'}), 200
    else:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200

@user_bp.route('/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = data['password']
    if 'is_active' in data:
        user.is_active = data['is_active']
    if 'company_id' in data:
        if Company.query.get(data['company_id']) is None:
            return jsonify({'error': 'Company not found'}), 404
        user.company_id = data['company_id']
    if 'role_id' in data:
        if Role.query.get(data['role_id']) is None:
            return jsonify({'error': 'Role not found'}), 404
        user.role_id = data['role_id']
    db.session.commit()
    return jsonify(user.to_dict()),200