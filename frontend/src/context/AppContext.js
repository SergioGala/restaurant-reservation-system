import React, { createContext, useReducer, useContext } from 'react';

// Store inicial
const initialState = {
  restaurants: [],
  reservations: [],
  loading: false,
  error: null,
};

// Tipos de acciones
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_RESTAURANTS: 'SET_RESTAURANTS',
  ADD_RESTAURANT: 'ADD_RESTAURANT',
  UPDATE_RESTAURANT: 'UPDATE_RESTAURANT',
  DELETE_RESTAURANT: 'DELETE_RESTAURANT',
  SET_RESERVATIONS: 'SET_RESERVATIONS',
  ADD_RESERVATION: 'ADD_RESERVATION',
  UPDATE_RESERVATION: 'UPDATE_RESERVATION',
  DELETE_RESERVATION: 'DELETE_RESERVATION',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    // Restaurantes
    case ACTIONS.SET_RESTAURANTS:
      return { ...state, restaurants: action.payload, loading: false };
    
    case ACTIONS.ADD_RESTAURANT:
      return { 
        ...state, 
        restaurants: [...state.restaurants, action.payload],
        loading: false 
      };
    
    case ACTIONS.UPDATE_RESTAURANT:
      return {
        ...state,
        restaurants: state.restaurants.map(r => 
          r.id === action.payload.id ? action.payload : r
        ),
        loading: false
      };
    
    case ACTIONS.DELETE_RESTAURANT:
      return {
        ...state,
        restaurants: state.restaurants.filter(r => r.id !== action.payload),
        loading: false
      };
    
    // Reservas
    case ACTIONS.SET_RESERVATIONS:
      return { ...state, reservations: action.payload, loading: false };
    
    case ACTIONS.ADD_RESERVATION:
      return {
        ...state,
        reservations: [...state.reservations, action.payload],
        loading: false
      };
    
    case ACTIONS.UPDATE_RESERVATION:
      return {
        ...state,
        reservations: state.reservations.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
        loading: false
      };
    
    case ACTIONS.DELETE_RESERVATION:
      return {
        ...state,
        reservations: state.reservations.filter(r => r.id !== action.payload),
        loading: false
      };
    
    default:
      return state;
  }
};


const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para consumir l contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};