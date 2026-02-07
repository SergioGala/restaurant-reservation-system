import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { ACTIONS } from '../context/AppContext';
import { getReservations, deleteReservation } from '../services/api';
import { COLORS } from '../constants';

export default function ReservationListScreen({ navigation }) {
  const { state, dispatch } = useApp();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await getReservations();
      dispatch({ type: ACTIONS.SET_RESERVATIONS, payload: response.data });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = (id, customerName) => {
    Alert.alert(
      'Confirmar',
      `¿Cancelar la reserva de ${customerName}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReservation(id);
              dispatch({ type: ACTIONS.DELETE_RESERVATION, payload: id });
              Alert.alert('Éxito', 'Reserva cancelada');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderReservation = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.customer_name}</Title>
        <Paragraph>Restaurante: {item.restaurant?.name}</Paragraph>
        <Paragraph>Fecha: {item.reservation_date}</Paragraph>
        <Paragraph>Personas: {item.number_of_people}</Paragraph>
        {item.customer_phone && <Paragraph>Tel: {item.customer_phone}</Paragraph>}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleDelete(item.id, item.customer_name)} color={COLORS.error}>
          Cancelar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={state.reservations}
        renderItem={renderReservation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('RestaurantList')}
        label="Nueva Reserva"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 10 },
  card: { marginBottom: 10 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
});