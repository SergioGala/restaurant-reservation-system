from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import date

class RestaurantSchema(Schema):
    """Schema para validar y serializar Restaurantes"""
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(allow_none=True)
    address = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    city = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    photo_url = fields.Url(allow_none=True)
    created_at = fields.DateTime(dump_only=True)


class ReservationSchema(Schema):
    """Schema para validar y serializar Reservas"""
    id = fields.Int(dump_only=True)
    restaurant_id = fields.Int(required=True)
    customer_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    customer_email = fields.Email(allow_none=True)
    customer_phone = fields.Str(allow_none=True, validate=validate.Length(max=20))
    reservation_date = fields.Date(required=True)
    number_of_people = fields.Int(
        required=True, 
        validate=validate.Range(min=1, max=20)
    )
    created_at = fields.DateTime(dump_only=True)
    
    # Campos anidados para mostrar info del restaurante al listar reservas
    restaurant = fields.Nested(RestaurantSchema, dump_only=True)
    
@validates('reservation_date')
def validate_reservation_date(self, value):
    """Validar que la fecha de reserva no sea en el pasado"""
    if value < date.today():
        raise ValidationError('La fecha de reserva no puede ser en el pasado')
    return value


# Instancias de los schemas para ser consumidas a posteriori
restaurant_schema = RestaurantSchema()
restaurants_schema = RestaurantSchema(many=True)
reservation_schema = ReservationSchema()
reservations_schema = ReservationSchema(many=True)