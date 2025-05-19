from flask import Blueprint, request, jsonify
from backend.models import Role
from backend.extensions import db
from sqlalchemy.exc import IntegrityError

role_bp=Blueprint('role',__name__,url_prefix='/api/role')

@role_bp.route('/', methods=['GET'])
def get_roles():
    if request.args.get('name'):
        name = request.args.get('name')
        roles = Role.query.filter(Role.name.ilike(f'%{name}%')).all()
        if not roles:
            return jsonify({'error': 'No roles found'}), 404
        return jsonify([role.to_dict() for role in roles]),200
    else:
        roles = Role.query.all()
        return jsonify([role.to_dict() for role in roles]),200
    
@role_bp.route('/<int:role_id>', methods=['GET'])
def get_role(role_id):
    role = Role.query.get_or_404(role_id)
    return jsonify(role.to_dict()), 200

@role_bp.route('/', methods=['POST'])
def create_role():
    try:
        data = request.get_json()
        new_role = Role(
            name=data['name'],
            description=data['description']
        )
        db.session.add(new_role)
        db.session.commit()
        return jsonify(new_role.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Role with this name already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@role_bp.route('/<int:role_id>',methods=['DELETE'])
def delete_role(role_id):
    role = Role.query.get_or_404(role_id)
    db.session.delete(role)
    db.session.commit()
    return jsonify({'message': 'Role deleted successfully'}), 200

@role_bp.route('/<int:role_id>', methods=['PATCH'])
def update_role(role_id):
    data = request.get_json()
    role = Role.query.get_or_404(role_id)
    if 'name' in data:
        role.name = data['name']
    if 'description' in data:
        role.description = data['description']
    db.session.commit()
    return jsonify(role.to_dict()), 200