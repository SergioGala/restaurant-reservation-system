from flask import Blueprint, request, jsonify
from app.models import db, Restaurant
from app.schemas import restaurant_schema, restaurants_schema
from marshmallow import ValidationError

restaurants_bp = Blueprint('restaurants', __name__, url_prefix='/api/restaurants')


@restaurants_bp.route('', methods=['GET'])
def get_restaurants():
    """
    Listar todos los restaurantes con filtros opcionales
    Query params: 
        - letter: Filtrar por letra inicial del nombre
        - city: Filtrar por ciudad
    """
    # Obtener parámetros de query
    letter = request.args.get('letter', '').upper()
    city = request.args.get('city', '')
    
    # Construir query base
    query = Restaurant.query
    
    # Aplicar filtros si existen
    if letter:
        query = query.filter(Restaurant.name.ilike(f'{letter}%'))
    
    if city:
        query = query.filter(Restaurant.city.ilike(f'%{city}%'))
    
    # Ejecutar query y ordenar alfabéticamente
    restaurants = query.order_by(Restaurant.name).all()
    
    return jsonify({
        'success': True,
        'data': restaurants_schema.dump(restaurants),
        'count': len(restaurants)
    }), 200


@restaurants_bp.route('/<int:id>', methods=['GET'])
def get_restaurant(id):
    """Obtener un restaurante por ID"""
    restaurant = Restaurant.query.get(id)
    
    if not restaurant:
        return jsonify({
            'success': False,
            'message': 'Restaurante no encontrado'
        }), 404
    
    return jsonify({
        'success': True,
        'data': restaurant_schema.dump(restaurant)
    }), 200


@restaurants_bp.route('', methods=['POST'])
def create_restaurant():
    """Crear un nuevo restaurante"""
    try:
        # Validar datos de entrada
        data = restaurant_schema.load(request.json)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Datos inválidos',
            'errors': err.messages
        }), 400
    
    # Crear nuevo restaurante
    new_restaurant = Restaurant(
        name=data['name'],
        description=data.get('description'),
        address=data['address'],
        city=data['city'],
        photo_url=data.get('photo_url')
    )
    
    db.session.add(new_restaurant)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Restaurante creado exitosamente',
        'data': restaurant_schema.dump(new_restaurant)
    }), 201


@restaurants_bp.route('/<int:id>', methods=['PUT'])
def update_restaurant(id):
    """Actualizar un restaurante existente"""
    restaurant = Restaurant.query.get(id)
    
    if not restaurant:
        return jsonify({
            'success': False,
            'message': 'Restaurante no encontrado'
        }), 404
    
    try:
        # Validar datos de entrada
        data = restaurant_schema.load(request.json, partial=True)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Datos inválidos',
            'errors': err.messages
        }), 400
    
    # Actualizar campos
    if 'name' in data:
        restaurant.name = data['name']
    if 'description' in data:
        restaurant.description = data['description']
    if 'address' in data:
        restaurant.address = data['address']
    if 'city' in data:
        restaurant.city = data['city']
    if 'photo_url' in data:
        restaurant.photo_url = data['photo_url']
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Restaurante actualizado exitosamente',
        'data': restaurant_schema.dump(restaurant)
    }), 200


@restaurants_bp.route('/<int:id>', methods=['DELETE'])
def delete_restaurant(id):
    """Eliminar un restaurante"""
    restaurant = Restaurant.query.get(id)
    
    if not restaurant:
        return jsonify({
            'success': False,
            'message': 'Restaurante no encontrado'
        }), 404
    
    # Guardar nombre para mensaje de confirmación
    restaurant_name = restaurant.name
    
    db.session.delete(restaurant)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': f'Restaurante "{restaurant_name}" eliminado exitosamente'
    }), 200