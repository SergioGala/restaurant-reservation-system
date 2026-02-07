import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { ACTIONS } from '../context/AppContext';
import { createRestaurant, updateRestaurant } from '../services/api';
import { COLORS } from '../constants';

export default function RestaurantFormScreen({ navigation, route }) {
  const restaurant = route.params?.restaurant;
  const isEdit = !!restaurant;
  
  const { dispatch } = useApp();
  
  const [name, setName] = useState(restaurant?.name || '');
  const [description, setDescription] = useState(restaurant?.description || '');
  const [address, setAddress] = useState(restaurant?.address || '');
  const [city, setCity] = useState(restaurant?.city || '');
  const [photoUrl, setPhotoUrl] = useState(restaurant?.photo_url || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !address || !city) {
      Alert.alert('Error', 'Nombre, dirección y ciudad son obligatorios');
      return;
    }

    setLoading(true);
    try {
      const data = { name, description, address, city, photo_url: photoUrl };
      
      if (isEdit) {
        const response = await updateRestaurant(restaurant.id, data);
        dispatch({ type: ACTIONS.UPDATE_RESTAURANT, payload: response.data });
        Alert.alert('Éxito', 'Restaurante actualizado');
      } else {
        const response = await createRestaurant(data);
        dispatch({ type: ACTIONS.ADD_RESTAURANT, payload: response.data });
        Alert.alert('Éxito', 'Restaurante creado');
      }
      
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
        label="Nombre *"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
      />
      <TextInput
        label="Dirección *"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        label="Ciudad *"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <TextInput
        label="URL de foto"
        value={photoUrl}
        onChangeText={setPhotoUrl}
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {isEdit ? 'Actualizar' : 'Crear'} Restaurante
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
});