from flask import Blueprint, request, jsonify
from app.models import db, Reservation, Restaurant
from app.schemas import reservation_schema, reservations_schema
from app.utils.validators import validate_restaurant_availability, validate_daily_reservation_limit
from marshmallow import ValidationError
from datetime import datetime

reservations_bp = Blueprint('reservations', __name__, url_prefix='/api/reservations')


@reservations_bp.route('', methods=['GET'])
def get_reservations():
    """
    Listar todas las reservas
    Query params opcionales:
        - restaurant_id: Filtrar por restaurante
        - date: Filtrar por fecha (formato: YYYY-MM-DD)
    """
    restaurant_id = request.args.get('restaurant_id', type=int)
    date_str = request.args.get('date')
    
    # Query base
    query = Reservation.query
    
    # Aplicar filtros
    if restaurant_id:
        query = query.filter(Reservation.restaurant_id == restaurant_id)
    
    if date_str:
        try:
            filter_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            query = query.filter(Reservation.reservation_date == filter_date)
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Formato de fecha inválido. Use YYYY-MM-DD'
            }), 400
    
    # Ordenar por fecha descendente (más recientes primero)
    reservations = query.order_by(Reservation.reservation_date.desc(), Reservation.created_at.desc()).all()
    
    return jsonify({
        'success': True,
        'data': reservations_schema.dump(reservations),
        'count': len(reservations)
    }), 200


@reservations_bp.route('/<int:id>', methods=['GET'])
def get_reservation(id):
    """Obtener una reserva por ID"""
    reservation = Reservation.query.get(id)
    
    if not reservation:
        return jsonify({
            'success': False,
            'message': 'Reserva no encontrada'
        }), 404
    
    return jsonify({
        'success': True,
        'data': reservation_schema.dump(reservation)
    }), 200


@reservations_bp.route('', methods=['POST'])
def create_reservation():
    """
    Crear una nueva reserva
    Validaciones:
        - Máximo 15 reservas por restaurante por día
        - Máximo 20 reservas totales por día
        - Fecha no puede ser en el pasado
    """
    try:
        # Validar estructura de datos
        data = reservation_schema.load(request.json)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Datos inválidos',
            'errors': err.messages
        }), 400
    
    # Verificar que el restaurante existe
    restaurant = Restaurant.query.get(data['restaurant_id'])
    if not restaurant:
        return jsonify({
            'success': False,
            'message': 'Restaurante no encontrado'
        }), 404
    
    # VALIDACIÓN 1: Verificar disponibilidad del restaurante (máx 15 mesas)
    is_valid, message, available = validate_restaurant_availability(
        db, 
        data['restaurant_id'], 
        data['reservation_date']
    )
    
    if not is_valid:
        return jsonify({
            'success': False,
            'message': message,
            'available_tables': available
        }), 400
    
    # VALIDACIÓN 2: Verificar límite diario total (máx 20 reservas)
    is_valid, message, total = validate_daily_reservation_limit(
        db, 
        data['reservation_date']
    )
    
    if not is_valid:
        return jsonify({
            'success': False,
            'message': message,
            'total_reservations': total
        }), 400
    
    # Crear la reserva
    new_reservation = Reservation(
        restaurant_id=data['restaurant_id'],
        customer_name=data['customer_name'],
        customer_email=data.get('customer_email'),
        customer_phone=data.get('customer_phone'),
        reservation_date=data['reservation_date'],
        number_of_people=data['number_of_people']
    )
    
    db.session.add(new_reservation)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Reserva creada exitosamente',
        'data': reservation_schema.dump(new_reservation),
        'available_tables_remaining': available - 1
    }), 201


@reservations_bp.route('/<int:id>', methods=['PUT'])
def update_reservation(id):
    """Actualizar una reserva existente"""
    reservation = Reservation.query.get(id)
    
    if not reservation:
        return jsonify({
            'success': False,
            'message': 'Reserva no encontrada'
        }), 404
    
    try:
        data = reservation_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Datos inválidos',
            'errors': err.messages
        }), 400
    
    # Si se cambia de restaurante o fecha, validar nuevamente
    new_restaurant_id = data.get('restaurant_id', reservation.restaurant_id)
    new_date = data.get('reservation_date', reservation.reservation_date)
    
    # Solo validar si cambió restaurante o fecha
    if new_restaurant_id != reservation.restaurant_id or new_date != reservation.reservation_date:
        # Validar disponibilidad del restaurante
        is_valid, message, available = validate_restaurant_availability(
            db, 
            new_restaurant_id, 
            new_date
        )
        
        if not is_valid:
            return jsonify({
                'success': False,
                'message': message
            }), 400
        
        # Validar límite diario total
        is_valid, message, total = validate_daily_reservation_limit(db, new_date)
        
        if not is_valid:
            return jsonify({
                'success': False,
                'message': message
            }), 400
    
    # Actualizar campos
    if 'restaurant_id' in data:
        reservation.restaurant_id = data['restaurant_id']
    if 'customer_name' in data:
        reservation.customer_name = data['customer_name']
    if 'customer_email' in data:
        reservation.customer_email = data['customer_email']
    if 'customer_phone' in data:
        reservation.customer_phone = data['customer_phone']
    if 'reservation_date' in data:
        reservation.reservation_date = data['reservation_date']
    if 'number_of_people' in data:
        reservation.number_of_people = data['number_of_people']
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Reserva actualizada exitosamente',
        'data': reservation_schema.dump(reservation)
    }), 200


@reservations_bp.route('/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    """Cancelar/eliminar una reserva"""
    reservation = Reservation.query.get(id)
    
    if not reservation:
        return jsonify({
            'success': False,
            'message': 'Reserva no encontrada'
        }), 404
    
    customer_name = reservation.customer_name
    
    db.session.delete(reservation)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': f'Reserva de {customer_name} cancelada exitosamente'
    }), 200


@reservations_bp.route('/availability/<int:restaurant_id>/<date>', methods=['GET'])
def check_availability(restaurant_id, date):
    """
    Endpoint adicional para verificar disponibilidad antes de reservar
    Parámetros:
        - restaurant_id: ID del restaurante
        - date: Fecha en formato YYYY-MM-DD
    """
    try:
        reservation_date = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({
            'success': False,
            'message': 'Formato de fecha inválido. Use YYYY-MM-DD'
        }), 400
    
    # Verificar que el restaurante existe
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({
            'success': False,
            'message': 'Restaurante no encontrado'
        }), 404
    
    # Verificar disponibilidad del restaurante
    is_valid_restaurant, msg_restaurant, available = validate_restaurant_availability(
        db, 
        restaurant_id, 
        reservation_date
    )
    
    # Verificar límite diario total
    is_valid_daily, msg_daily, total = validate_daily_reservation_limit(
        db, 
        reservation_date
    )
    
    return jsonify({
        'success': True,
        'available': is_valid_restaurant and is_valid_daily,
        'restaurant': {
            'available_tables': available,
            'message': msg_restaurant
        },
        'daily_limit': {
            'total_reservations': total,
            'remaining': 20 - total,
            'message': msg_daily
        }
    }), 200