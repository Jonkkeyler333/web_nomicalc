# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from backend.controllers.company import company_bp

# app=Flask(__name__)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)
# migrate = Migrate(app, db) 

# app.register_blueprint(company)

# import models

from flask import Flask
from backend.extensions import db, migrate
from backend.controllers.company import company_bp  # Asegúrate de que company_bp exista
import os

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///site.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicializa extensiones con la app
    db.init_app(app)
    migrate.init_app(app, db)

    # Registra blueprints
    app.register_blueprint(company_bp)

    # Importa modelos después de inicializar db
    with app.app_context():
        from backend import models
        # db.create_all()  # Crea tablas si no existen

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)