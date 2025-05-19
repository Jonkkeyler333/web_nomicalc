from flask import Flask
from flask import Response
from backend.extensions import db, migrate
from backend.controllers.company import company_bp
from backend.controllers.user import user_bp
from backend.controllers.role import role_bp
from backend.controllers.employee import employee_bp
from backend.controllers.bank import bank_bp
import os

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///site.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    @app.route('/')
    def index():
        return Response("<h1>Welcome to the API</h1>",200)

    # Inicializa extensiones con la app
    db.init_app(app)
    migrate.init_app(app, db)
    # Registra blueprints
    app.register_blueprint(company_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(role_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(bank_bp)

    with app.app_context():
        from backend import models
        # db.create_all()  # Crea tablas si no existen

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)