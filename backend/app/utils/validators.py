from app.models import Reservation
from config import Config
from sqlalchemy import func

def validate_restaurant_availability(db, restaurant_id, reservation_date):
    """
    Valida que el restaurante tenga mesas disponibles para la fecha
    Regla: Máximo 15 reservas por día por restaurante
    
    Returns:
        tuple: (is_valid: bool, message: str, available_tables: int)
    """
    # Contar reservas existentes para ese restaurante en esa fecha
    existing_reservations = db.session.query(func.count(Reservation.id)).filter(
        Reservation.restaurant_id == restaurant_id,
        Reservation.reservation_date == reservation_date
    ).scalar()
    
    available_tables = Config.MAX_TABLES_PER_RESTAURANT - existing_reservations
    
    if existing_reservations >= Config.MAX_TABLES_PER_RESTAURANT:
        return False, f'No hay mesas disponibles en este restaurante para la fecha seleccionada', 0
    
    return True, 'Mesa disponible', available_tables


def validate_daily_reservation_limit(db, reservation_date):
    """
    Valida que no se excedan las 20 reservas totales del día
    Regla: Máximo 20 reservas por día en TODOS los restaurantes
    
    Returns:
        tuple: (is_valid: bool, message: str, total_reservations: int)
    """
    # Contar todas las reservas para esa fecha (todos los restaurantes)
    total_reservations = db.session.query(func.count(Reservation.id)).filter(
        Reservation.reservation_date == reservation_date
    ).scalar()
    
    if total_reservations >= Config.MAX_RESERVATIONS_PER_DAY:
        return False, f'Se ha alcanzado el límite de {Config.MAX_RESERVATIONS_PER_DAY} reservas para esta fecha', total_reservations
    
    return True, 'Dentro del límite diario', total_reservations