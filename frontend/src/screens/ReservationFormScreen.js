import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText, Card, Title, Menu, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { ACTIONS } from '../context/AppContext';
import { createReservation, getRestaurants } from '../services/api';
import { COLORS, SPACING, RADIUS } from '../constants';

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
  const [menuVisible, setMenuVisible] = useState(false);

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

  const getSelectedRestaurant = () => {
    if (preselectedRestaurant) return preselectedRestaurant;
    return state.restaurants.find(r => r.id === parseInt(restaurantId));
  };

  const selectedRestaurant = getSelectedRestaurant();

  const handleSubmit = async () => {
    if (!restaurantId || !customerName || !date || !numberOfPeople) {
      Alert.alert('Campos incompletos', 'Completa todos los campos obligatorios');
      return;
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert('Fecha inválida', 'Usa el formato YYYY-MM-DD (ej: 2026-12-31)');
      return;
    }

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      Alert.alert('Fecha inválida', 'La fecha no puede ser en el pasado');
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
      
      Alert.alert(
        '✓ Reserva Confirmada', 
        `Mesa reservada para ${numberOfPeople} personas en ${selectedRestaurant?.name}`,
        [{ text: 'OK', onPress: () => navigation.navigate('ReservationList') }]
      );
    } catch (error) {
      Alert.alert('Error al reservar', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="calendar-plus" size={50} color={COLORS.secondary} />
          <Text style={styles.headerTitle}>Nueva Reserva</Text>
          <Text style={styles.headerSubtitle}>Completa los datos para reservar una mesa</Text>
        </View>

        {/* Restaurante seleccionado */}
        {selectedRestaurant && (
          <Card style={styles.restaurantCard} elevation={2}>
            <Card.Content>
              <View style={styles.restaurantHeader}>
                <MaterialCommunityIcons name="store-check" size={24} color={COLORS.secondary} />
                <Text style={styles.restaurantLabel}>Restaurante seleccionado:</Text>
              </View>
              <Title style={styles.restaurantName}>{selectedRestaurant.name}</Title>
              <Text style={styles.restaurantCity}>{selectedRestaurant.city}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Selector de restaurante (si no viene preseleccionado) */}
        {!preselectedRestaurant && (
          <>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TextInput
                  label="Restaurante *"
                  value={selectedRestaurant?.name || ''}
                  onFocus={() => setMenuVisible(true)}
                  style={styles.input}
                  mode="outlined"
                  left={<TextInput.Icon icon="store" />}
                  right={<TextInput.Icon icon="chevron-down" />}
                  editable={false}
                />
              }
            >
              {state.restaurants.map((restaurant) => (
                <Menu.Item
                  key={restaurant.id}
                  onPress={() => {
                    setRestaurantId(restaurant.id.toString());
                    setMenuVisible(false);
                  }}
                  title={restaurant.name}
                  leadingIcon="store"
                />
              ))}
            </Menu>
            <HelperText type="info">Selecciona el restaurante donde deseas reservar</HelperText>
          </>
        )}

        <Divider style={styles.divider} />

        {/* Datos del cliente */}
        <Text style={styles.sectionTitle}>📋 Datos del Cliente</Text>

        <TextInput
          label="Nombre completo *"
          value={customerName}
          onChangeText={setCustomerName}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          error={!customerName}
        />
        {!customerName && <HelperText type="error">Campo obligatorio</HelperText>}

        <TextInput
          label="Email"
          value={customerEmail}
          onChangeText={setCustomerEmail}
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          autoCapitalize="none"
        />
        <HelperText type="info">Recibirás confirmación por email</HelperText>

        <TextInput
          label="Teléfono"
          value={customerPhone}
          onChangeText={setCustomerPhone}
          keyboardType="phone-pad"
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="phone" />}
        />
        <HelperText type="info">Para confirmaciones y cambios</HelperText>

        <Divider style={styles.divider} />

        {/* Detalles de la reserva */}
        <Text style={styles.sectionTitle}>📅 Detalles de la Reserva</Text>

        <TextInput
          label="Fecha (YYYY-MM-DD) *"
          value={date}
          onChangeText={setDate}
          placeholder="2026-02-15"
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="calendar" />}
          error={!date}
        />
        <View style={styles.quickDates}>
          <Button 
            mode="outlined" 
            compact 
            onPress={() => setDate(getTodayDate())}
            style={styles.quickDateButton}
          >
            Hoy
          </Button>
          <Button 
            mode="outlined" 
            compact 
            onPress={() => setDate(getTomorrowDate())}
            style={styles.quickDateButton}
          >
            Mañana
          </Button>
        </View>

        <TextInput
          label="Número de personas *"
          value={numberOfPeople}
          onChangeText={setNumberOfPeople}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="account-group" />}
          error={!numberOfPeople}
        />
        <HelperText type="info">Mínimo 1, máximo 15 personas</HelperText>

        {/* Botón de confirmación */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !restaurantId || !customerName || !date || !numberOfPeople}
          style={styles.submitButton}
          icon="check-circle"
          contentStyle={styles.submitButtonContent}
          buttonColor={COLORS.secondary}
        >
          Confirmar Reserva
        </Button>

        <Text style={styles.requiredNote}>* Campos obligatorios</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  form: {
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  restaurantCard: {
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  restaurantLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  restaurantName: {
    fontSize: 20,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs / 2,
  },
  restaurantCity: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  input: { 
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.surface,
  },
  divider: {
    marginVertical: SPACING.lg,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  quickDates: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  quickDateButton: {
    flex: 1,
  },
  submitButton: { 
    marginTop: SPACING.xl,
    borderRadius: RADIUS.sm,
  },
  submitButtonContent: {
    paddingVertical: SPACING.sm,
  },
  requiredNote: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: SPACING.md,
  },
});