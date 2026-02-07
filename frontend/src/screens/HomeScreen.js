import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Text, Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS } from '../constants';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={GRADIENTS.primary}
        style={styles.header}
      >
        <MaterialCommunityIcons name="silverware-fork-knife" size={60} color="white" />
        <Title style={styles.headerTitle}>Sistema de Reservas</Title>
        <Text style={styles.headerSubtitle}>Gestiona restaurantes y reservas fácilmente</Text>
      </LinearGradient>

      {/* Opciones principales */}
      <View style={styles.content}>
        <Card style={styles.card} elevation={3}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="store" size={40} color={COLORS.primary} />
            </View>
            <View style={styles.cardText}>
              <Title style={styles.cardTitle}>Restaurantes</Title>
              <Text style={styles.cardDescription}>
                Gestiona el catálogo de restaurantes
              </Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('RestaurantList')}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Abrir
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card} elevation={3}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="calendar-check" size={40} color={COLORS.secondary} />
            </View>
            <View style={styles.cardText}>
              <Title style={styles.cardTitle}>Reservas</Title>
              <Text style={styles.cardDescription}>
                Consulta y gestiona las reservas
              </Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('ReservationList')}
              style={[styles.button, { backgroundColor: COLORS.secondary }]}
              labelStyle={styles.buttonLabel}
            >
              Ver Reservas
            </Button>
          </Card.Actions>
        </Card>

        {/* Info cards */}
        <View style={styles.infoRow}>
          <Card style={styles.infoCard} elevation={2}>
            <Card.Content style={styles.infoContent}>
              <MaterialCommunityIcons name="table-chair" size={28} color={COLORS.info} />
              <Text style={styles.infoNumber}>15</Text>
              <Text style={styles.infoLabel}>Mesas por restaurante</Text>
            </Card.Content>
          </Card>

          <Card style={styles.infoCard} elevation={2}>
            <Card.Content style={styles.infoContent}>
              <MaterialCommunityIcons name="calendar-today" size={28} color={COLORS.warning} />
              <Text style={styles.infoNumber}>20</Text>
              <Text style={styles.infoLabel}>Reservas máximas/día</Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.xl,
    paddingTop: SPACING.xl * 2,
    paddingBottom: SPACING.xl * 1.5,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: 'white',
    marginTop: SPACING.md,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: SPACING.xs,
    fontSize: 16,
  },
  content: {
    padding: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.lg,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  button: {
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  infoCard: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    borderRadius: 12,
  },
  infoContent: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  infoNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});