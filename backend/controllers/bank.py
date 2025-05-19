from flask import Blueprint,request,jsonify
from backend.models import Bank
from backend.extensions import db

bank_bp=Blueprint('bank',__name__,url_prefix='/api/bank')

@bank_bp.route('/',methods=['GET'])
def get_banks():
    if request.args.get('name'):
        name = request.args.get('name')
        banks = Bank.query.filter(Bank.name.ilike(f'%{name}%')).all()
        if not banks:
            return jsonify({'error': 'No banks found'}), 404
        return jsonify([bank.to_dict() for bank in banks]), 200
    else:
        banks = Bank.query.all()
        return jsonify([bank.to_dict() for bank in banks]), 200

@bank_bp.route('/<int:bank_id>',methods=['GET'])
def get_bank(bank_id):
    bank = Bank.query.get_or_404(bank_id)
    return jsonify(bank.to_dict()), 200

@bank_bp.route('/',methods=['POST'])
def create_bank():
    data = request.get_json()
    new_bank = Bank(
        name=data['name'],
        address=data['address'],
        phone=data['phone'],
        email=data['email'],
        website=data['website']
    )
    db.session.add(new_bank)
    db.session.commit()
    return jsonify(new_bank.to_dict()), 201

@bank_bp.route('/<int:bank_id>',methods=['DELETE'])
def delete_bank(bank_id):
    bank = Bank.query.get_or_404(bank_id)
    db.session.delete(bank)
    db.session.commit()
    return jsonify({'message': 'Bank deleted successfully'}), 200

@bank_bp.route('/<int:bank_id>',methods=['PATCH'])
def update_bank(bank_id):
    data = request.get_json()
    bank = Bank.query.get_or_404(bank_id)
    if 'name' in data:
        bank.name = data['name']
    if 'address' in data:
        bank.address = data['address']
    if 'phone' in data:
        bank.phone = data['phone']
    if 'email' in data:
        bank.email = data['email']
    if 'website' in data:
        bank.website = data['website']
    db.session.commit()
    return jsonify(bank.to_dict()), 200