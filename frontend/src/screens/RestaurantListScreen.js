import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, TextInput, Chip } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { ACTIONS } from '../context/AppContext';
import { getRestaurants, deleteRestaurant } from '../services/api';
import { COLORS } from '../constants';

export default function RestaurantListScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [filterLetter, setFilterLetter] = useState('');
  const [filterCity, setFilterCity] = useState('');

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async (filters = {}) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await getRestaurants(filters);
      dispatch({ type: ACTIONS.SET_RESTAURANTS, payload: response.data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      Alert.alert('Error', error.message);
    }
  };

  const handleFilter = () => {
    const filters = {};
    if (filterLetter) filters.letter = filterLetter;
    if (filterCity) filters.city = filterCity;
    loadRestaurants(filters);
  };

  const handleClearFilters = () => {
    setFilterLetter('');
    setFilterCity('');
    loadRestaurants();
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      'Confirmar',
      `¿Eliminar el restaurante "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRestaurant(id);
              dispatch({ type: ACTIONS.DELETE_RESTAURANT, payload: id });
              Alert.alert('Éxito', 'Restaurante eliminado');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderRestaurant = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.city}</Paragraph>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('RestaurantForm', { restaurant: item })}>
          Editar
        </Button>
        <Button onPress={() => handleDelete(item.id, item.name)} color={COLORS.error}>
          Eliminar
        </Button>
        <Button onPress={() => navigation.navigate('ReservationForm', { restaurant: item })}>
          Reservar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          label="Filtrar por letra"
          value={filterLetter}
          onChangeText={setFilterLetter}
          style={styles.input}
          maxLength={1}
        />
        <TextInput
          label="Filtrar por ciudad"
          value={filterCity}
          onChangeText={setFilterCity}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleFilter} style={styles.filterButton}>
          Filtrar
        </Button>
        {(filterLetter || filterCity) && (
          <Chip onClose={handleClearFilters}>Limpiar filtros</Chip>
        )}
      </View>

      <FlatList
        data={state.restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('RestaurantForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  filterContainer: { padding: 10, backgroundColor: COLORS.surface },
  input: { marginBottom: 10 },
  filterButton: { marginBottom: 10 },
  list: { padding: 10 },
  card: { marginBottom: 10 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
});