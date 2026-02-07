import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { ACTIONS } from '../context/AppContext';
import { createReservation, getRestaurants } from '../services/api';
import { COLORS } from '../constants';

export default function ReservationFormScreen({ navigation, route }) {
  const preselectedRestaurant = route.params?.restaurant;
  
  const { state, dispatch } = useApp();
  const [restaurantId, setRestaurantId] = useState(preselectedRestaurant?.id?.toString() || '');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('2');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.restaurants.length === 0) {
      loadRestaurants();
    }
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await getRestaurants();
      dispatch({ type: ACTIONS.SET_RESTAURANTS, payload: response.data });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSubmit = async () => {
    if (!restaurantId || !customerName || !date || !numberOfPeople) {
      Alert.alert('Error', 'Completa los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const data = {
        restaurant_id: parseInt(restaurantId),
        customer_name: customerName,
        customer_email: customerEmail || null,
        customer_phone: customerPhone || null,
        reservation_date: date,
        number_of_people: parseInt(numberOfPeople),
      };
      
      const response = await createReservation(data);
      dispatch({ type: ACTIONS.ADD_RESERVATION, payload: response.data });
      Alert.alert('Éxito', 'Reserva creada correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="ID del Restaurante *"
        value={restaurantId}
        onChangeText={setRestaurantId}
        keyboardType="numeric"
        style={styles.input}
        disabled={!!preselectedRestaurant}
      />
      {preselectedRestaurant && (
        <HelperText type="info">
          Reservando en: {preselectedRestaurant.name}
        </HelperText>
      )}
      
      <TextInput
        label="Nombre del cliente *"
        value={customerName}
        onChangeText={setCustomerName}
        style={styles.input}
      />
      
      <TextInput
        label="Email"
        value={customerEmail}
        onChangeText={setCustomerEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      
      <TextInput
        label="Teléfono"
        value={customerPhone}
        onChangeText={setCustomerPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      
      <TextInput
        label="Fecha (YYYY-MM-DD) *"
        value={date}
        onChangeText={setDate}
        placeholder="2026-02-15"
        style={styles.input}
      />
      
      <TextInput
        label="Número de personas *"
        value={numberOfPeople}
        onChangeText={setNumberOfPeople}
        keyboardType="numeric"
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Crear Reserva
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
});