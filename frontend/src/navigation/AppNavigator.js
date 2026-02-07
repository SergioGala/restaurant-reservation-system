import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants';

// Importar pantallas
import HomeScreen from '../screens/HomeScreen';
import RestaurantListScreen from '../screens/RestaurantListScreen';
import RestaurantFormScreen from '../screens/RestaurantFormScreen';
import ReservationListScreen from '../screens/ReservationListScreen';
import ReservationFormScreen from '../screens/ReservationFormScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen 
          name="RestaurantList" 
          component={RestaurantListScreen} 
          options={{ title: 'Restaurantes' }}
        />
        <Stack.Screen 
          name="RestaurantForm" 
          component={RestaurantFormScreen} 
          options={({ route }) => ({ 
            title: route.params?.restaurant ? 'Editar Restaurante' : 'Nuevo Restaurante' 
          })}
        />
        <Stack.Screen 
          name="ReservationList" 
          component={ReservationListScreen} 
          options={{ title: 'Reservas' }}
        />
        <Stack.Screen 
          name="ReservationForm" 
          component={ReservationFormScreen} 
          options={{ title: 'Nueva Reserva' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}