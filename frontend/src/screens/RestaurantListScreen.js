import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, TextInput, Chip, Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { ACTIONS } from '../context/AppContext';
import { getRestaurants, deleteRestaurant } from '../services/api';
import { COLORS, SPACING, RADIUS } from '../constants';

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
      'Confirmar eliminación',
      `¿Estás seguro de eliminar "${name}"? Se eliminarán también sus reservas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRestaurant(id);
              dispatch({ type: ACTIONS.DELETE_RESTAURANT, payload: id });
              Alert.alert('✓ Éxito', 'Restaurante eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderRestaurant = ({ item }) => (
    <Card style={styles.card} elevation={2}>
      {/* Imagen o placeholder */}
      <View style={styles.imageContainer}>
        {item.photo_url ? (
          <Card.Cover 
            source={{ uri: item.photo_url }} 
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={50} color={COLORS.primary} />
          </View>
        )}
      </View>
      
      <Card.Content style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Title style={styles.restaurantName}>{item.name}</Title>
          <Chip 
            mode="outlined" 
            style={styles.cityChip}
            textStyle={styles.cityChipText}
          >
            {item.city}
          </Chip>
        </View>
        
        <View style={styles.addressRow}>
          <MaterialCommunityIcons name="map-marker" size={16} color={COLORS.textLight} />
          <Text style={styles.address}>{item.address}</Text>
        </View>
        
        {item.description && (
          <Paragraph numberOfLines={2} style={styles.description}>
            {item.description}
          </Paragraph>
        )}
      </Card.Content>
      
      <Card.Actions style={styles.cardActions}>
         <Button 
          icon="pencil" 
          mode="text"
          onPress={() => navigation.navigate('RestaurantForm', { restaurant: item })}
          textColor={COLORS.primary}
        >
          Editar
        </Button>
          <Button 
          icon="delete" 
          mode="text"
          onPress={() => handleDelete(item.id, item.name)} 
          textColor={COLORS.error}
        >
          Eliminar
        </Button>
        <Button 
          icon="calendar-plus" 
          mode="contained"
          onPress={() => navigation.navigate('ReservationForm', { restaurant: item })}
          buttonColor={COLORS.secondary}
          style={styles.reserveButton}
        >
          Reservar
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="store-off" size={80} color={COLORS.textLight} />
      <Text style={styles.emptyText}>No hay restaurantes</Text>
      <Text style={styles.emptySubtext}>
        {filterLetter || filterCity 
          ? 'Prueba con otros filtros' 
          : 'Crea tu primer restaurante'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filterContainer}>
        <View style={styles.inputRow}>
          <TextInput
            label="A-Z"
            value={filterLetter}
            onChangeText={setFilterLetter}
            style={styles.inputSmall}
            maxLength={1}
            mode="outlined"
            left={<TextInput.Icon icon="alphabetical" />}
          />
          <TextInput
            label="Ciudad"
            value={filterCity}
            onChangeText={setFilterCity}
            style={styles.inputLarge}
            mode="outlined"
            left={<TextInput.Icon icon="city" />}
          />
        </View>
        
        <View style={styles.filterActions}>
          <Button 
            mode="contained" 
            onPress={handleFilter} 
            style={styles.filterButton}
            icon="filter"
          >
            Filtrar
          </Button>
          {(filterLetter || filterCity) && (
            <Chip 
              onClose={handleClearFilters} 
              style={styles.clearChip}
              icon="close-circle"
            >
              Limpiar filtros
            </Chip>
          )}
        </View>
      </View>

      {/* Lista */}
      {state.loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando restaurantes...</Text>
        </View>
      ) : (
        <FlatList
          data={state.restaurants}
          renderItem={renderRestaurant}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        label="Nuevo"
        onPress={() => navigation.navigate('RestaurantForm')}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  filterContainer: { 
    padding: SPACING.md, 
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
   inputSmall: {
    flex: 1.2,
  },
  inputLarge: {
    flex: 2,
  },
  filterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  filterButton: {
    borderRadius: RADIUS.sm,
  },
  clearChip: {
    backgroundColor: COLORS.background,
  },
  list: { 
    padding: SPACING.md,
    paddingBottom: 100,
  },
  card: { 
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 150,
    backgroundColor: COLORS.background,
  },
  image: {
    height: 150,
  },
  placeholderImage: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  cardContent: {
    paddingTop: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  restaurantName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cityChip: {
    backgroundColor: COLORS.primaryLight,
  },
  cityChipText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  address: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  description: {
    color: COLORS.textLight,
    fontSize: 14,
    marginTop: SPACING.xs,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.sm,
  },
  reserveButton: {
    borderRadius: RADIUS.sm,
  },
  fab: { 
    position: 'absolute', 
    right: SPACING.md, 
    bottom: SPACING.md, 
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
  },
});