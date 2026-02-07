# 🍽️ Sistema de Reservas de Restaurantes

Sistema completo de gestión y reservas de restaurantes desarrollado con **Flask (Backend)** y **React Native (Frontend)**.

[Flask]
[React Native]
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat&logo=python)](https://www.python.org/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación-rápida)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Documentación](#-documentación)
- [Capturas de Pantalla](#-capturas-de-pantalla)

---

## ✨ Características

### Funcionalidades Implementadas
- ✅ **CRUD completo de restaurantes** (Crear, Leer, Actualizar, Eliminar)
- ✅ **Listado con filtros** por letra inicial del nombre y ciudad
- ✅ **Sistema de reservas** con validaciones de negocio
- ✅ **Gestión de disponibilidad** de mesas en tiempo real
- ✅ **Interfaz moderna y responsiva** para móvil y web

### Reglas de Negocio
- 🔒 Máximo **15 mesas por restaurante** por día
- 🔒 Máximo **20 reservas totales** por día (entre todos los restaurantes)
- 🔒 No se permiten reservas en fechas pasadas
- ✅ Validaciones en frontend y backend

---

## 🏗️ Arquitectura

Este proyecto implementa una **arquitectura desacoplada y escalable**:

### Backend: Blueprint Pattern + Application Factory
- ✅ Modular y testeable
- ✅ Separación de responsabilidades
- ✅ Fácil de escalar y mantener

### Frontend: Component-Based con Context API
- ✅ Componentes reutilizables
- ✅ Estado global nativo (sin Redux)
- ✅ Organización por features

📖 **Ver análisis completo de arquitecturas:** [ARQUITECTURAS.md](./ARQUITECTURAS.md)

---

## 🛠️ Tecnologías

### Backend
- **Python 3.13**
- **Flask 3.1.2** - Web framework
- **SQLAlchemy** - ORM
- **Marshmallow** - Validación y serialización
- **Flask-CORS** - Cross-Origin Resource Sharing
- **SQLite** - Base de datos

### Frontend
- **React Native** (Expo)
- **React Navigation** - Navegación
- **React Native Paper** - Componentes UI Material Design
- **Context API** - Gestión de estado
- **Expo Linear Gradient** - Gradientes
- **Fetch API** - Llamadas HTTP

---

##  Instalación Rápida

### Prerrequisitos
- Python 3.9+ 
- Node.js 18+
- Git

### 1️⃣ Clonar repositorio
```bash
git clone https://github.com/TU_USUARIO/restaurant-reservation-system.git
cd restaurant-reservation-system
```

### 2️⃣ Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py
```

Backend corriendo en: `http://localhost:5000`

### 3️⃣ Frontend
```bash
cd frontend
npm install
npx expo start
```

Presiona `w` para web, o escanea QR con Expo Go.

---

##  Estructura del Proyecto
```
restaurant-reservation-system/
│
├── backend/                     # API REST Flask
│   ├── app/
│   │   ├── __init__.py         # Application Factory
│   │   ├── models.py           # Modelos SQLAlchemy
│   │   ├── schemas.py          # Validaciones Marshmallow
│   │   ├── routes/
│   │   │   ├── restaurants.py  # Endpoints CRUD restaurantes
│   │   │   └── reservations.py # Endpoints CRUD reservas
│   │   └── utils/
│   │       └── validators.py   # Validadores de negocio
│   ├── config.py               # Configuración
│   ├── run.py                  # Entry point
│   └── requirements.txt        # Dependencias Python
│
├── frontend/                    # App React Native
│   └── src/
│       ├── screens/            # Pantallas principales
│       ├── navigation/         # Configuración de navegación
│       ├── context/            # Context API + Reducers
│       ├── services/           # Llamadas a la API
│       └── constants/          # Constantes (colores, URLs)
│
├── ARQUITECTURAS.md            # Documentación de arquitecturas
└── README.md                   # Este archivo
```

---

## 🌐 API Endpoints

### Restaurantes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/restaurants` | Listar todos (filtros: letter, city) |
| GET | `/api/restaurants/:id` | Obtener por ID |
| POST | `/api/restaurants` | Crear restaurante |
| PUT | `/api/restaurants/:id` | Actualizar restaurante |
| DELETE | `/api/restaurants/:id` | Eliminar restaurante |

### Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reservations` | Listar todas (filtros: restaurant_id, date) |
| GET | `/api/reservations/:id` | Obtener por ID |
| POST | `/api/reservations` | Crear reserva |
| PUT | `/api/reservations/:id` | Actualizar reserva |
| DELETE | `/api/reservations/:id` | Cancelar reserva |
| GET | `/api/reservations/availability/:restaurant_id/:date` | Verificar disponibilidad |

**Ver documentación completa:** [backend/README.md](./backend/README.md)

##  Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

##  Despliegue

### Backend (Producción)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Frontend
```bash
npx expo build:web
# o
eas build --platform android
eas build --platform ios
```

---

##  Notas Técnicas

### Por qué estas decisiones:

**SQLite en desarrollo:**
- Fácil de configurar y compartir
- En producción se usaría PostgreSQL/MySQL

**Expo en lugar de React Native CLI:**
- Setup instantáneo
- Ideal para desarrollo rápido
- Web + Mobile desde un solo código

**Context API en lugar de Redux:**
- Aplicación de tamaño medio no requiere Redux
- Menos boilerplate, mismo resultado
- Nativo de React

**Fetch en lugar de Axios:**
- Nativo, sin dependencias extra
- Suficiente para este proyecto
- Axios solo se justifica con interceptors complejos

---

##  Decisiones de Arquitectura

Ver análisis detallado de 3 arquitecturas evaluadas para cada tecnología en [ARQUITECTURAS.md](./ARQUITECTURAS.md)

---

##  Licencia

Proyecto desarrollado como prueba técnica.

---

##  Autor

**[Tu Nombre]**
- GitHub: [@SergioGala](https://github.com/SergioGala)
- LinkedIn: [Sergio Gala Fernandez](https://www.linkedin.com/in/sergio-gala-fernandez/)
