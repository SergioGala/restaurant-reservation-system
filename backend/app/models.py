from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Restaurant(db.Model):
    """Modelo de Restaurante"""
    __tablename__ = 'restaurants'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    address = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    photo_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación con reservas (1TM)
    reservations = db.relationship('Reservation', backref='restaurant', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Restaurant {self.name}>'


class Reservation(db.Model):
    """Modelo de Reserva"""
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=True)
    customer_phone = db.Column(db.String(20), nullable=True)
    reservation_date = db.Column(db.Date, nullable=False)
    number_of_people = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Reservation {self.customer_name} - {self.reservation_date}>'