from flask import Blueprint, request, jsonify
from backend.models import Company
from backend.extensions import db

company_bp=Blueprint('company',__name__,url_prefix='/api/company')

@company_bp.route('/', methods=['GET'])
def get_companies():
    companies = Company.query.all()
    return jsonify([{
        'id': company.id,
        'name': company.name,
        'nit': company.nit,
        'address': company.address,
        'phone': company.phone,
        'email': company.email,
        'website': company.website
    } for company in companies]), 200
    
@company_bp.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    company = Company.query.get_or_404(company_id)
    return jsonify({
        'id': company.id,
        'name': company.name,
        'nit': company.nit,
        'address': company.address,
        'phone': company.phone,
        'email': company.email,
        'website': company.website
    }), 200
    
@company_bp.route('/', methods=['POST'])
def create_company():
    data = request.get_json()
    new_company = Company(
        name=data['name'],
        nit=data['nit'],
        address=data['address'],
        phone=data['phone'],
        email=data['email'],
        website=data.get('website')
    )
    db.session.add(new_company)
    db.session.commit()
    return jsonify({
        'id': new_company.id,
        'name': new_company.name,
        'nit': new_company.nit,
        'address': new_company.address,
        'phone': new_company.phone,
        'email': new_company.email,
        'website': new_company.website
    }), 201

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
    return jsonify({
        'id': company.id,
        'name': company.name,
        'nit': company.nit,
        'address': company.address,
        'phone': company.phone,
        'email': company.email,
        'website': company.website
    }), 200