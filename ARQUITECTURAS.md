# 🏗️ Documentación de Arquitecturas

Este documento explica las decisiones de arquitectura del proyecto y las alternativas evaluadas.

---

## 🎯 Resumen Ejecutivo

**Backend:** Blueprint Pattern + Application Factory (Flask)  
**Frontend:** Component-Based + Context API (React Native)

**Por qué:** Balance óptimo entre simplicidad, escalabilidad y mantenibilidad para un proyecto de este tamaño.

---

## 🐍 Backend: 3 Arquitecturas Evaluadas

### 1. Single Module (Archivo único)
```
app.py  ← Todo el código aquí
```

**❌ Descartada:** No escala, difícil de testear, código acoplado.

---

### 2. Layered Architecture (Por capas)
```
app/
├── controllers/    ← Endpoints
├── services/       ← Lógica de negocio
├── repositories/   ← Acceso a BD
└── models/         ← Modelos
```

**✅ Pros:** Separación clara de responsabilidades  
**⚠️ Contras:** Puede ser demasiado para este proyecto  
**Decisión:** Viable, pero Blueprints es más Flask-idiomatic

---

### 3. **Blueprint Pattern + Application Factory** ⭐ **ELEGIDA**
```
app/
├── __init__.py          ← Application Factory
├── models.py            ← Modelos
├── schemas.py           ← Validaciones
├── routes/
│   ├── restaurants.py   ← Blueprint restaurantes
│   └── reservations.py  ← Blueprint reservas
└── utils/
    └── validators.py    ← Lógica de negocio
```

**Por qué esta arquitectura:**

✅ **Patrón oficial de Flask** para apps medianas/grandes  
✅ **Modular:** Cada blueprint es independiente  
✅ **Testeable:** Blueprints se testean aisladamente  
✅ **Escalable:** Añadir módulos (auth, pagos) es trivial  
✅ **Production-ready:** Usado en apps reales

**Ejemplo:**
```python
# Cada módulo es un blueprint
restaurants_bp = Blueprint('restaurants', __name__)

@restaurants_bp.route('/api/restaurants')
def get_restaurants():
    # Lógica del endpoint
```

---

## ⚛️ Frontend: 3 Arquitecturas Evaluadas

### 1. Flat Structure (Todo mezclado)
```
components/  ← Todo aquí (pantallas + componentes)
```

**❌ Descartada:** Se vuelve caótico rápidamente.

---

### 2. Feature-Based (Por funcionalidad)
```
features/
├── restaurants/
│   ├── screens/
│   ├── components/
│   └── services/
└── reservations/
    ├── screens/
    └── ...
```

**✅ Pros:** Muy escalable para apps grandes (50+ pantallas)  
**⚠️ Contras:** Overkill para 5 pantallas  
**Decisión:** Guardar para si el proyecto crece

---

### 3. **Component-Based + Context API** ⭐ **ELEGIDA**
```
src/
├── screens/          ← Pantallas (5)
├── components/       ← Componentes reutilizables
├── navigation/       ← React Navigation
├── context/          ← Estado global (Context API)
├── services/         ← Llamadas API
└── constants/        ← Config, colores
```

**Por qué esta arquitectura:**

✅ **Proporcional al proyecto:** 5 pantallas no necesitan feature-based  
✅ **Context API suficiente:** Redux sería overkill  
✅ **Estructura intuitiva:** Fácil encontrar archivos  
✅ **Rápido de desarrollar:** Menos configuración  
✅ **Escalable:** Soporta hasta 20-30 pantallas sin problema

**Ejemplo:**
```javascript
// Estado global con Context API
const { state, dispatch } = useApp();

// Acceso desde cualquier componente
dispatch({ type: ACTIONS.SET_RESTAURANTS, payload: data });
```

---

## 🤔 ¿Por qué NO Redux?

**Redux requiere:**
- Store configuration
- Actions/Action Creators
- Reducers
- Middleware (thunk/saga)
- Más boilerplate

**Context API ofrece:**
- ✅ Nativo de React
- ✅ Menos código
- ✅ Mismo resultado para este proyecto
- ✅ Más fácil de entender

**Cuándo sí usar Redux:** Apps con 50+ acciones, lógica compleja, time-travel debugging necesario.

---

## 🤔 ¿Por qué NO Fetch wrapper (Axios)?

**Ya tenemos Fetch nativo que:**
- ✅ No requiere instalación
- ✅ Funciona perfecto en React Native
- ✅ Suficiente para CRUD simple

**Axios se justifica cuando:**
- Necesitas interceptors complejos
- Autenticación con tokens en cada request
- Retry logic
- Request/response transformers

**Para este proyecto:** Fetch es suficiente.

---

## 📊 Comparativa Rápida

### Backend

| Arquitectura | Escalabilidad | Complejidad | Para este proyecto |
|--------------|---------------|-------------|--------------------|
| Single Module | ⭐ | ⭐ | ❌ |
| Layered | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⚠️ |
| **Blueprints** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ |

### Frontend

| Arquitectura | Escalabilidad | Complejidad | Para este proyecto |
|--------------|---------------|-------------|--------------------|
| Flat | ⭐ | ⭐ | ❌ |
| Feature-Based | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⚠️ |
| **Component-Based** | ⭐⭐⭐⭐ | ⭐⭐ | ✅ |

---

## 🚀 Plan de Escalabilidad

### Si el proyecto crece a 20+ pantallas:

**Mantener la estructura actual** y simplemente añadir:
- Más screens/
- Más components/
- Más services/

### Si el proyecto crece a 50+ pantallas:

**Migrar a Feature-Based:**
```
src/
├── features/
│   ├── restaurants/
│   ├── reservations/
│   ├── auth/
│   └── payments/
└── shared/
```

---

## 💡 Decisiones Clave

### ¿Por qué SQLite?
✅ Fácil de configurar y compartir  
✅ Perfecto para desarrollo  
📝 En producción: PostgreSQL

### ¿Por qué Expo?
✅ Setup en minutos  
✅ Web + Mobile desde mismo código  
✅ Ideal para desarrollo rápido

### ¿Por qué Marshmallow?
✅ Validación robusta  
✅ Mensajes de error claros  
✅ Serialización automática

---

## 📚 Conclusión

Las arquitecturas elegidas son:
- ✅ **Proporcionales** al tamaño del proyecto
- ✅ **Escalables** si el proyecto crece
- ✅ **Mantenibles** y fáciles de entender
- ✅ **Production-ready** y probadas en apps reales

No son ni demasiado simples (que no escalan) ni demasiado complejas (que ralentizan el desarrollo).

**Balance perfecto para una prueba técnica.**
