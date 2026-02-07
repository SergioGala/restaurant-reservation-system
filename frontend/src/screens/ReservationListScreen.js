import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, Text, Chip, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { ACTIONS } from '../context/AppContext';
import { getReservations, deleteReservation } from '../services/api';
import { COLORS, SPACING, RADIUS } from '../constants';

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
      'Cancelar Reserva',
      `¿Confirmas la cancelación de la reserva de ${customerName}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReservation(id);
              dispatch({ type: ACTIONS.DELETE_RESERVATION, payload: id });
              Alert.alert('✓ Éxito', 'Reserva cancelada correctamente');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const renderReservation = ({ item }) => (
    <Card style={styles.card} elevation={2}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account" size={30} color={COLORS.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Title style={styles.customerName}>{item.customer_name}</Title>
            <Chip 
              icon="calendar" 
              style={styles.dateChip}
              textStyle={styles.dateChipText}
            >
              {formatDate(item.reservation_date)}
            </Chip>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="store" size={20} color={COLORS.textLight} />
            <Text style={styles.detailLabel}>Restaurante:</Text>
            <Text style={styles.detailValue}>{item.restaurant?.name || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="account-group" size={20} color={COLORS.textLight} />
            <Text style={styles.detailLabel}>Personas:</Text>
            <Text style={styles.detailValue}>{item.number_of_people}</Text>
          </View>

          {item.customer_phone && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="phone" size={20} color={COLORS.textLight} />
              <Text style={styles.detailLabel}>Teléfono:</Text>
              <Text style={styles.detailValue}>{item.customer_phone}</Text>
            </View>
          )}

          {item.customer_email && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="email" size={20} color={COLORS.textLight} />
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue} numberOfLines={1}>{item.customer_email}</Text>
            </View>
          )}
        </View>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button 
          mode="contained"
          onPress={() => handleDelete(item.id, item.customer_name)} 
          buttonColor={COLORS.error}
          icon="close-circle"
          style={styles.cancelButton}
        >
          Cancelar Reserva
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="calendar-remove" size={80} color={COLORS.textLight} />
      <Text style={styles.emptyText}>No hay reservas</Text>
      <Text style={styles.emptySubtext}>Las reservas aparecerán aquí</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('RestaurantList')}
        style={styles.emptyButton}
        icon="plus"
      >
        Crear Primera Reserva
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{state.reservations.length}</Text>
          <Text style={styles.statLabel}>Total Reservas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {state.reservations.filter(r => 
              new Date(r.reservation_date) >= new Date()
            ).length}
          </Text>
          <Text style={styles.statLabel}>Próximas</Text>
        </View>
      </View>

      {state.loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando reservas...</Text>
        </View>
      ) : (
        <FlatList
          data={state.reservations}
          renderItem={renderReservation}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={renderEmpty}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="Nueva Reserva"
        onPress={() => navigation.navigate('RestaurantList')}
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
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  list: { 
    padding: SPACING.md,
    paddingBottom: 100,
  },
  card: { 
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    marginBottom: SPACING.xs,
  },
  dateChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
  },
  dateChipText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  detailsContainer: {
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailLabel: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  detailValue: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
  },
  cancelButton: {
    borderRadius: RADIUS.sm,
  },
  fab: { 
    position: 'absolute', 
    right: SPACING.md, 
    bottom: SPACING.md, 
    backgroundColor: COLORS.secondary,
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
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    borderRadius: RADIUS.sm,
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