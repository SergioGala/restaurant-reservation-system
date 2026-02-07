import os

class Config:
    """Configuración base de la aplicación"""
    
    # Secret key para sesiones (En produccion habria que cambiarlo)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Configuración de la base de datos SQLite
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///restaurant_reservations.db'
    
    # Desactivar tracking de modificaciones (Considero que va a aumentar la performance)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Número máximo de mesas por restaurante (Modelo de negocio)
    MAX_TABLES_PER_RESTAURANT = 15
    
    # Número máximo de reservas por día en total (Modelo de negocio)
    MAX_RESERVATIONS_PER_DAY = 20