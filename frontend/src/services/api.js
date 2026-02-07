import { API_URL } from '../constants';

// Función auxiliar para manejar errores
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }
  
  return data;
};

// ==================== RESTAURANTES ====================

export const getRestaurants = async (filters = {}) => {
  try {
    let url = `${API_URL}/restaurants`;
    const params = new URLSearchParams();
    
    if (filters.letter) params.append('letter', filters.letter);
    if (filters.city) params.append('city', filters.city);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting restaurants:', error);
    throw error;
  }
};

export const getRestaurant = async (id) => {
  try {
    const response = await fetch(`${API_URL}/restaurants/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting restaurant:', error);
    throw error;
  }
};

export const createRestaurant = async (restaurantData) => {
  try {
    const response = await fetch(`${API_URL}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurantData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

export const updateRestaurant = async (id, restaurantData) => {
  try {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurantData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

export const deleteRestaurant = async (id) => {
  try {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
};

// ==================== RESERVAS ====================

export const getReservations = async (filters = {}) => {
  try {
    let url = `${API_URL}/reservations`;
    const params = new URLSearchParams();
    
    if (filters.restaurant_id) params.append('restaurant_id', filters.restaurant_id);
    if (filters.date) params.append('date', filters.date);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting reservations:', error);
    throw error;
  }
};

export const getReservation = async (id) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting reservation:', error);
    throw error;
  }
};

export const createReservation = async (reservationData) => {
  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const updateReservation = async (id, reservationData) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
};

export const deleteReservation = async (id) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};

export const checkAvailability = async (restaurantId, date) => {
  try {
    const response = await fetch(`${API_URL}/reservations/availability/${restaurantId}/${date}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};