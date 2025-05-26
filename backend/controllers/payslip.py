from flask import Blueprint,request,jsonify
from backend.models import Payslip,Employee
from backend.extensions import db
from flask import send_file
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

payslip_bp=Blueprint('payslip',__name__,url_prefix='/api/payslip')

def check_values(data,*args):
    for arg in args:
        if data[arg] < 0 or data[arg] == None:
            return False

@payslip_bp.route('/',methods=['GET'])
def get_payslips():
    if request.args.get('employee_id'):
        employee_id = request.args.get('employee_id')
        payslips = Payslip.query.filter(Payslip.employee_id==employee_id).all()
        # if not payslips:
        #     return jsonify({'error': 'No payslips found'}), 404
        return jsonify([payslip.to_dict() for payslip in payslips]), 200
    else:
        payslips = Payslip.query.all()
        return jsonify([payslip.to_dict() for payslip in payslips]), 200

@payslip_bp.route('/<int:payslip_id>',methods=['GET'])
def get_payslip(payslip_id):
    payslip = Payslip.query.get_or_404(payslip_id)
    return jsonify(payslip.to_dict()), 200

@payslip_bp.route('/',methods=['POST'])
def create_payslip():
    data = request.get_json()
    if Employee.query.get(data['employee_id']) is None:
        return jsonify({'error': 'Employee not found'}), 404
    if 'month' not in data or 'year' not in data:
        return jsonify({'error': 'Month and year are required'}), 400
    if Payslip.query.filter_by(employee_id=data['employee_id'], month=data['month'], year=data['year']).first():
        return jsonify({'error': 'Payslip for this month and year already exists'}), 400
    if 'gross_salary' not in data or 'deductions' not in data:
        return jsonify({'error': 'Gross salary, net salary and deductions are required'}), 400
    if check_values(data,'gross_salary','deductions') == False:
        return jsonify({'error': 'Gross salary, net salary and deductions must be positive'}), 400
    if 'observations' not in data:
        data['observations'] = ''
    if 'allowances' not in data:
        data['allowances'] = 0
    new_payslip = Payslip(
        employee_id=data['employee_id'],
        month=data['month'],
        year=data['year'],
        basic_salary=data['gross_salary'],
        allowances=data['allowances'],
        net_salary=0,
        deductions=data['deductions'],
        observations=data['observations'],
        account_number=data['account_number'],
    )
    db.session.add(new_payslip)
    db.session.commit()
    return jsonify(new_payslip.to_dict()), 201

@payslip_bp.route('/<int:payslip_id>',methods=['DELETE'])
def delete_payslip(payslip_id):
    payslip = Payslip.query.get_or_404(payslip_id)
    db.session.delete(payslip)
    db.session.commit()
    return jsonify({'message': 'Payslip deleted successfully'}), 200

@payslip_bp.route('/<int:payslip_id>',methods=['PATCH'])
def update_payslip(payslip_id):
    data = request.get_json()
    payslip = Payslip.query.get_or_404(payslip_id)
    if 'month' in data:
        payslip.month = data['month']
    if 'year' in data:
        payslip.year = data['year']
    if 'basic_salary' in data:
        if check_values(data,'basic_salary') == False:
            return jsonify({'error': 'Basic salary must be positive'}), 400
        payslip.basic_salary = data['basic_salary']
    if 'allowances' in data:
        if check_values(data,'allowances') == False:
            return jsonify({'error': 'Allowances must be positive'}), 400
        payslip.allowances = data['allowances']
    if 'deductions' in data:
        if check_values(data,'deductions') == False:
            return jsonify({'error': 'Deductions must be positive'}), 400
        payslip.deductions = data['deductions']
    if 'observations' in data:
        payslip.observations = data['observations']
    if 'account_number' in data:
        if Employee.query.get(data['employee_id']) is None:
            return jsonify({'error': 'Employee not found'}), 404
        payslip.account_number = data['account_number']
    db.session.commit()
    return jsonify(payslip.to_dict()), 200

@payslip_bp.route('/calculate/<int:payslip_id>',methods=['GET'])
def get_net_salary(payslip_id):
    payslip = Payslip.query.get_or_404(payslip_id)
    net_salary = payslip.basic_salary + payslip.allowances - payslip.deductions
    return jsonify({'net_salary': net_salary}), 200

@payslip_bp.route('/pdf/<int:payslip_id>',methods=['GET'])
def get_payslip_pdf(payslip_id):
    payslip = Payslip.query.get_or_404(payslip_id)
    employee = Employee.query.get_or_404(payslip.employee_id)
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, "Recibo de Nómina")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 100, f"Empleado: {employee.name} {employee.last_name}")
    p.drawString(50, height - 120, f"Mes/Año: {payslip.month}/{payslip.year}")
    p.drawString(50, height - 140, f"Sueldo Básico: ${payslip.basic_salary:,.2f}")
    p.drawString(50, height - 160, f"Auxilios: ${payslip.allowances:,.2f}")
    p.drawString(50, height - 180, f"Deducciones: ${payslip.deductions:,.2f}")
    net_salary = payslip.basic_salary + payslip.allowances - payslip.deductions
    p.drawString(50, height - 200, f"Salario Neto: ${net_salary:,.2f}")
    p.drawString(50, height - 220, f"Observaciones: {payslip.observations or '-'}")
    p.showPage()
    p.save()
    buffer.seek(0)
    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"payslip_{payslip.id}.pdf",
        mimetype='application/pdf'
    )