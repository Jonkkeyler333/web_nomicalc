from app import db

class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))
    __table_args__ = (
        db.UniqueConstraint('name', name='uq_role_name'),
    )
    def __repr__(self):
        return f"role('{self.id}', '{self.name}')"
    
class Company(db.Model):
    __tablename__ = 'company'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    nit = db.Column(db.String(20), unique=True, nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    website = db.Column(db.String(100))
    __table_args__ = (
        db.UniqueConstraint('name', name='uq_company_name'),
        db.UniqueConstraint('nit', name='uq_company_nit'),
        db.UniqueConstraint('email', name='uq_company_email'),
    )

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(70), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id',name='fk_user_company'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id',name='fk_user_role'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    last_login = db.Column(db.DateTime, default=db.func.current_timestamp())
    last_logout = db.Column(db.DateTime, default=db.func.current_timestamp())
    __table_args__ = (
        db.UniqueConstraint('email', name='uq_user_email'),
    )
    
class Employee(db.Model):
    __tablename__ = 'employee'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(70), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id',name='fk_employee_role'), nullable=False)
    hire_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    company_id = db.Column(db.Integer, db.ForeignKey('company.id',name='fk_employee_company'), nullable=False)
    __table_args__ = (
        db.UniqueConstraint('email', name='uq_employee_email'),
    )
    
class Payslip(db.Model):
    __tablename__ = 'payslip'
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id',name='fk_payslip_employee'), nullable=False)
    month = db.Column(db.String(20), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    basic_salary = db.Column(db.Float, nullable=False)
    allowances = db.Column(db.Float, nullable=False)
    deductions = db.Column(db.Float, nullable=False)
    net_salary = db.Column(db.Float, nullable=False)
    observations = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class Bank(db.Model):
    __tablename__ = 'bank'
    id = db.Column(db.Integer, primary_key=True)
    employee_id= db.Column(db.Integer, db.ForeignKey('employee.id',name='fk_bank_employee'), nullable=False)
    bank_name = db.Column(db.String(50), unique=True, nullable=False)
    nit = db.Column(db.String(20), unique=True, nullable=False)
    address = db.Column(db.String(200), nullable=False)
    account_number = db.Column(db.String(20), unique=True, nullable=False)
    account_type = db.Column(db.String(20), nullable=False)
    __table_args__ = (
        db.UniqueConstraint('bank_name', name='uq_bank_bank_name'),
        db.UniqueConstraint('nit', name='uq_bank_nit'),
        db.UniqueConstraint('account_number', name='uq_bank_account_number'),
    )