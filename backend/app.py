from flask import Flask
from flask import Response
from backend.extensions import db, migrate , jwt
from backend.controllers.company import company_bp
from backend.controllers.user import user_bp
from backend.controllers.role import role_bp
from backend.controllers.employee import employee_bp
from backend.controllers.bank_account import bank_bp
from backend.controllers.payslip import payslip_bp
from backend.controllers.auth import auth_bp
import os

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///site.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'una_clave_secreta_segura'
    
    @app.route('/')
    def index():
        return Response("<h1>Welcome to the <em>API</em> of Web_nomicalc</h1> <h2>Ve a /api/employee</h2>",200)

    # Inicializa extensiones con la app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    # Registra blueprints
    app.register_blueprint(company_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(role_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(bank_bp)
    app.register_blueprint(payslip_bp)
    app.register_blueprint(auth_bp)

    with app.app_context():
        from backend import models
        # db.create_all()  # Crea tablas si no existen

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)