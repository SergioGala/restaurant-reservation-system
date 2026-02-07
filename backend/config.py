import os

class Config:
    """Configuración base de la aplicación"""
    
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Detectar si estamos en producción (Render usa DATABASE_URL)
    if os.environ.get('DATABASE_URL'):
        # Producción: PostgreSQL
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
        # Render usa postgres:// pero SQLAlchemy necesita postgresql://
        if SQLALCHEMY_DATABASE_URI.startswith('postgres://'):
            SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace('postgres://', 'postgresql://', 1)
    else:
        # Desarrollo: SQLite
        SQLALCHEMY_DATABASE_URI = 'sqlite:///restaurant_reservations.db'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    MAX_TABLES_PER_RESTAURANT = 15
    MAX_RESERVATIONS_PER_DAY = 20