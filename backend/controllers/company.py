from flask import Blueprint, request, jsonify
from backend.models import Company
from backend.extensions import db
from sqlalchemy.exc import IntegrityError
from random import randint

company_bp=Blueprint('company',__name__,url_prefix='/api/company')

@company_bp.route('/', methods=['GET'])
def get_companies():
    if request.args.get('name'):
        name = request.args.get('name')
        companies = Company.query.filter(Company.name.ilike(f'%{name}%')).all()
        if not companies:
            return jsonify({'error': 'No companies found'}), 404
        return jsonify([company.to_dict() for company in companies]), 200
    else:
        companies = Company.query.all()
        return jsonify([company.to_dict() for company in companies]), 200
    
@company_bp.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    company = Company.query.get_or_404(company_id)
    return jsonify(company.to_dict()), 200

@company_bp.route('/code/<int:code>', methods=['GET'])
def get_company_by_code(code):
    company = Company.query.filter_by(code=code).first()
    if not company:
        return jsonify({'error': 'Company not found'}), 404
    return jsonify(company.to_dict()), 200

@company_bp.route('/', methods=['POST'])
def create_company():
    try :
        data = request.get_json()
        new_company = Company(
            name=data['name'],
            nit=data['nit'],
            address=data['address'],
            phone=data['phone'],
            email=data['email'],
            website=data['website'],
            code=randint(100,9999)
        )
        db.session.add(new_company)
        db.session.commit()
        return jsonify(new_company.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Company with this name, nit or email already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@company_bp.route('/<int:company_id>',methods=['DELETE'])
def delete_company(company_id):
    company = Company.query.get_or_404(company_id)
    db.session.delete(company)
    db.session.commit()
    return jsonify({'message': 'Company deleted successfully'}), 200
   
@company_bp.route('/<int:company_id>', methods=['PATCH'])
def update_company(company_id):
    data = request.get_json()
    company = Company.query.get_or_404(company_id)
    if 'name' in data:
        company.name = data['name']
    if 'nit' in data:
        company.nit = data['nit']
    if 'address' in data:
        company.address = data['address']
    if 'phone' in data:
        company.phone = data['phone']
    if 'email' in data:
        company.email = data['email']
    if 'website' in data:
        company.website = data['website']
    db.session.commit()
    return jsonify(company.to_dict()), 200