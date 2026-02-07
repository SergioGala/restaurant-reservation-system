import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { COLORS } from '../constants';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Sistema de Reservas</Title>
      
      <Button
        mode="contained"
        onPress={() => navigation.navigate('RestaurantList')}
        style={styles.button}
      >
        Gestionar Restaurantes
      </Button>
      
      <Button
        mode="contained"
        onPress={() => navigation.navigate('ReservationList')}
        style={styles.button}
      >
        Ver Reservas
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 40,
    color: COLORS.primary,
  },
  button: {
    marginVertical: 10,
  },
});