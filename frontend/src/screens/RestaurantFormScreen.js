import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { ACTIONS } from '../context/AppContext';
import { createRestaurant, updateRestaurant } from '../services/api';
import { COLORS, SPACING, RADIUS } from '../constants';

const SUGGESTED_URLS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de',
];

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
      Alert.alert('Campos requeridos', 'Nombre, dirección y ciudad son obligatorios');
      return;
    }

    setLoading(true);
    try {
      const data = { 
        name, 
        description, 
        address, 
        city, 
        photo_url: photoUrl || SUGGESTED_URLS[0] // URL por defecto si está vacío
      };
      
      if (isEdit) {
        const response = await updateRestaurant(restaurant.id, data);
        dispatch({ type: ACTIONS.UPDATE_RESTAURANT, payload: response.data });
        Alert.alert('✓ Éxito', 'Restaurante actualizado correctamente');
      } else {
        const response = await createRestaurant(data);
        dispatch({ type: ACTIONS.ADD_RESTAURANT, payload: response.data });
        Alert.alert('✓ Éxito', 'Restaurante creado correctamente');
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
      <View style={styles.form}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name={isEdit ? "store-edit" : "store-plus"} 
            size={50} 
            color={COLORS.primary} 
          />
          <Text style={styles.headerTitle}>
            {isEdit ? 'Editar Restaurante' : 'Nuevo Restaurante'}
          </Text>
        </View>

        {/* Campos obligatorios */}
        <TextInput
          label="Nombre del restaurante *"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="store" />}
          error={!name}
        />
        {!name && <HelperText type="error">Campo obligatorio</HelperText>}

        <TextInput
          label="Dirección *"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="map-marker" />}
          error={!address}
        />
        {!address && <HelperText type="error">Campo obligatorio</HelperText>}

        <TextInput
          label="Ciudad *"
          value={city}
          onChangeText={setCity}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="city" />}
          error={!city}
        />
        {!city && <HelperText type="error">Campo obligatorio</HelperText>}

        {/* Campos opcionales */}
        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="text" />}
        />
        <HelperText type="info">Describe el tipo de comida, ambiente, etc.</HelperText>

        <TextInput
          label="URL de la foto (opcional)"
          value={photoUrl}
          onChangeText={setPhotoUrl}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="image" />}
        />
        <HelperText type="info">
          Deja vacío para usar imagen por defecto
        </HelperText>

        {/* Sugerencias de URLs */}
        {!isEdit && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>📸 Imágenes sugeridas:</Text>
            <View style={styles.chipsContainer}>
              {SUGGESTED_URLS.map((url, index) => (
                <Chip
                  key={index}
                  onPress={() => setPhotoUrl(url)}
                  style={styles.chip}
                  icon="image"
                  mode={photoUrl === url ? "flat" : "outlined"}
                  selected={photoUrl === url}
                >
                  Opción {index + 1}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Botón de envío */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !name || !address || !city}
          style={styles.submitButton}
          icon={isEdit ? "check" : "plus"}
          contentStyle={styles.submitButtonContent}
        >
          {isEdit ? 'Actualizar Restaurante' : 'Crear Restaurante'}
        </Button>

        {/* Nota sobre campos requeridos */}
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
  input: { 
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.surface,
  },
  suggestionsContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    marginBottom: SPACING.xs,
  },
  submitButton: { 
    marginTop: SPACING.lg,
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