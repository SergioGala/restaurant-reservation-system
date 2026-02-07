from app.routes.restaurants import restaurants_bp
from app.routes.reservations import reservations_bp

def register_routes(app):
    """Blueprints register list"""
    app.register_blueprint(restaurants_bp)
    app.register_blueprint(reservations_bp)