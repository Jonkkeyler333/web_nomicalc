from flask import Blueprint, request, jsonify
from backend.models import BankAccount
from backend.extensions import db

bank_bp = Blueprint('bank', __name__, url_prefix='/api/bank')

@bank_bp.route('/', methods=['GET'])
def get_banks():
    bank_name = request.args.get('bank_name')
    if bank_name:
        banks = BankAccount.query.filter(BankAccount.bank_name.ilike(f'%{bank_name}%')).all()
    else:
        banks = BankAccount.query.all()
    if not banks:
        return jsonify({'error': 'No banks found'}), 404
    return jsonify([bank.to_dict() for bank in banks]), 200

@bank_bp.route('/<int:bank_id>', methods=['GET'])
def get_bank(bank_id):
    bank = BankAccount.query.get_or_404(bank_id)
    return jsonify(bank.to_dict()), 200

@bank_bp.route('/', methods=['POST'])
def create_bank():
    data = request.get_json()
    new_bank = BankAccount(
        account_number=data['account_number'],
        employee_id=data['employee_id'],
        bank_name=data['bank_name'],
        nit=data['nit'],
        address=data['address'],
        account_type=data['account_type']
    )
    db.session.add(new_bank)
    db.session.commit()
    return jsonify(new_bank.to_dict()), 201

@bank_bp.route('/<int:account_number>', methods=['PATCH'])
def update_bank(account_number):
    data = request.get_json()
    bank = BankAccount.query.get_or_404(account_number)
    if 'employee_id' in data:
        bank.employee_id = data['employee_id']
    if 'bank_name' in data:
        bank.bank_name = data['bank_name']
    if 'nit' in data:
        bank.nit = data['nit']
    if 'address' in data:
        bank.address = data['address']
    if 'account_number' in data:
        bank.account_number = data['account_number']
    if 'account_type' in data:
        bank.account_type = data['account_type']
    db.session.commit()
    return jsonify(bank.to_dict()), 200

@bank_bp.route('/<int:account_number>', methods=['DELETE'])
def delete_bank(account_number):
    bank = BankAccount.query.get_or_404(account_number)
    db.session.delete(bank)
    db.session.commit()
    return jsonify({'message': 'BankAccount deleted successfully'}), 200

@bank_bp.route('/employee/<int:employee_id>', methods=['GET'])
def get_bank_by_employee(employee_id):
    bank = BankAccount.query.filter_by(employee_id=employee_id).first()
    if not bank:
        return jsonify({'error': 'No banks found for this employee'}), 404
    return jsonify(bank.to_dict()), 200