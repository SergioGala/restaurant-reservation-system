from flask import Flask
from flask_cors import CORS
from config import Config
from app.models import db

def create_app(config_class=Config):
    """
    Application Factory Pattern
    Crea y configura la aplicación Flask
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # extensiones
    db.init_app(app)
    CORS(app)  
    
    #  blueprints 
    from app.routes import register_routes
    register_routes(app)
    
    with app.app_context():
        db.create_all()
    
   
    @app.route('/')
    def index():
        return {
            'message': 'API de Reservas de Restaurantes',
            'version': '1.0',
            'endpoints': {
                'restaurants': '/api/restaurants',
                'reservations': '/api/reservations'
            }
        }
    
    # Manejador de errores 404
    @app.errorhandler(404)
    def not_found(error):
        return {
            'success': False,
            'message': 'Endpoint no encontrado'
        }, 404
    
    # Manejador de errores 500
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {
            'success': False,
            'message': 'Error interno del servidor'
        }, 500
    
    return app