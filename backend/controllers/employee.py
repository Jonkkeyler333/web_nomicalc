from flask import Blueprint,request,jsonify
from backend.models import Employee,Company,Role
from backend.extensions import db

employee_bp=Blueprint('employee',__name__,url_prefix='/api/employee')

@employee_bp.route('/',methods=['GET'])
def get_employees():
    if request.args.get('name'):
        name = request.args.get('name')
        employees = Employee.query.filter(Employee.name.ilike(f'%{name}%')).all()
        if not employees:
            return jsonify({'error': 'No employees found'}), 404
        return jsonify([employee.to_dict() for employee in employees]), 200
    else:
        employees = Employee.query.all()
        return jsonify([employee.to_dict() for employee in employees]), 200
    
@employee_bp.route('/<int:employee_id>',methods=['GET'])
def get_employee(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    return jsonify(employee.to_dict()), 200

@employee_bp.route('/',methods=['POST'])
def create_employee():
    data = request.get_json()
    if Company.query.get(data['company_id']) is None:
        return jsonify({'error': 'Company not found'}), 404
    if Role.query.get(data['role_id']) is None:
        return jsonify({'error': 'Role not found'}), 404
    new_employee = Employee(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        address=data['address'],
        role_id=data['role_id'],
        hire_date=data['hire_date'],
        company_id=data['company_id']
    )
    db.session.add(new_employee)
    db.session.commit()
    return jsonify(new_employee.to_dict()), 201

@employee_bp.route('/<int:employee_id>',methods=['DELETE'])
def delete_employee(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': 'Employee deleted successfully'}), 200

@employee_bp.route('/<int:employee_id>',methods=['PATCH'])
def update_employee(employee_id):
    data = request.get_json()
    employee = Employee.query.get_or_404(employee_id)
    if 'name' in data:
        employee.name = data['name']
    if 'email' in data:
        employee.email = data['email']
    if 'phone' in data:
        employee.phone = data['phone']
    if 'address' in data:
        employee.address = data['address']
    if 'role_id' in data:
        employee.role_id = data['role_id']
    if 'hire_date' in data:
        employee.hire_date = data['hire_date']
    if 'company_id' in data:
        employee.company_id = data['company_id']
    db.session.commit()
    return jsonify(employee.to_dict()), 200