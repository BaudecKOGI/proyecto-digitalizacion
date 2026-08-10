# 🚀 Proyecto Pasantías - Frontend (React + Vite)

Plataforma integral para la gestión y visualización interactiva de **Proyectos Digitales** y **Diseños 3D**. Desarrollado bajo un enfoque modular, escalable y con altos estándares de UI/UX.

---

## 📖 Tabla de Contenidos

- [🎯 Arquitectura y Tecnologías](#-arquitectura-y-tecnologías)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙️ Requisitos Previos](#️-requisitos-previos)
- [🚀 Instalación y Ejecución](#-instalación-y-ejecución)
- [🎨 Sistema de Diseño (UI/UX)](#-sistema-de-diseño-uiux)
- [🔧 Buenas Prácticas Implementadas](#-buenas-prácticas-implementadas)

---

## 🎯 Arquitectura y Tecnologías

El proyecto fue construido priorizando el rendimiento, la separación de responsabilidades (Clean Architecture en el frontend) y una experiencia inmersiva para visualizaciones 3D.

**Core Stack:**
- ⚛️ **[React 18](https://react.dev/)**: Librería principal de UI.
- ⚡ **[Vite](https://vitejs.dev/)**: Bundler ultrarrápido (HMR instántaneo).
- 🛣️ **[React Router v6](https://reactrouter.com/)**: Gestión de rutas (Públicas, Dashboard y Rutas protegidas).
- 📦 **[Material-UI (MUI)](https://mui.com/)** + **[Tailwind CSS](https://tailwindcss.com/)**: Híbrido de componentes robustos con clases utilitarias ágiles.

**Visualización y 3D:**
- 🧊 **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)**: Motor 3D declarativo basado en Three.js.
- 🎥 **[@react-three/drei](https://github.com/pmndrs/drei)**: Helpers avanzados (OrbitControls, Stage, FBXLoaders) para escenas 3D interactivas.
- 🪄 **[Framer Motion](https://www.framer.com/motion/)**: Animaciones de transición fluidas.

**Gestión de Estado y Servicios:**
- 📡 **Servicios API Centralizados**: Capa de abstracción usando `fetch` (en `src/services/api.js`).
- 🔐 **Context API**: Manejo de autenticación global (`UserContext`).

---

## 📂 Estructura del Proyecto

El código fuente (`src/`) sigue una organización altamente modular por dominios y roles:

```text
frontend/src/
├── components/       # Componentes reusables (Botones, Modales, Tarjetas).
├── contexts/         # Contextos globales de React (UserContext).
├── hooks/            # Custom Hooks para abstraer lógica (si aplica).
├── layouts/          # Envolturas estructurales (EditorLayout, PublicLayout, CleanLayout).
├── lib/              # Utilidades puras (Logger, formateadores de fechas, etc).
├── pages/            # Vistas principales separadas por contexto:
│   ├── dashboard/    #   - Vistas privadas (Gestión de 3D, Proyectos, Usuarios).
│   ├── editor/       #   - Panel de edición (Hub, etc).
│   └── public/       #   - Vistas públicas (Landing, Visor 3D, ODS).
├── services/         # Integración centralizada con la API Backend.
├── styles/           # CSS Globales (Variables de temas, animaciones base).
├── App.jsx           # Orquestador de rutas.
└── main.jsx          # Entry point de la aplicación.
```

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalados:
- **Node.js** (Versión 18+ recomendada)
- **NPM** o **Yarn**

---

## 🚀 Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno:**
   Crear un archivo `.env` en la raíz (basado en `.env.example`) y definir la URL de tu API backend:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Ejecutar el servidor de desarrollo (Local):**
   ```bash
   npm run dev
   ```

4. **Compilar para Producción:**
   ```bash
   npm run build
   ```

---

## 🎨 Sistema de Diseño (UI/UX)

La plataforma utiliza un diseño basado en tokens de color, definido de forma híbrida en Tailwind y Variables CSS nativas, permitiendo un fácil cambio de temas.

- **Diseño 3D (Fabricación Digital)**: Basado en acentos cyan (`#30C5D2`).
- **Proyectos Digitales (Software)**: Basado en acentos índigo (`#4B46C9`).
- **Iconografía**: Se emplean vectores de alta calidad gracias a **Phosphor Icons**.
- **Tipografía**: Jerarquía estructurada usando fuentes _sans-serif_ modernas e intercaladas con fuentes de exhibición para títulos impactantes.

---

## 🔧 Buenas Prácticas Implementadas

1. **Code-Splitting y Lazy Loading**: 
   Los componentes muy pesados o específicos (como los visores 3D) pueden ser aislados para que el bundle principal de la app se mantenga ligero.
2. **Abstracción de Lógica (Smart & Dumb Components)**: 
   Las vistas (`pages`) actúan como orquestadores de datos (Smart), y delegan la renderización a componentes funcionales puros (Dumb) ubicados en subcarpetas (ej. `FormView`, `components`).
3. **Manejo Centralizado de Errores y Auth**: 
   Todo el flujo de `fetch` intercepta tokens y errores comunes en `services/api.js`.
4. **Protección de Rutas**: 
   Uso de `AuthGuard` para evitar acceso de usuarios no autorizados a paneles administrativos.

---
*Desarrollado y estructurado con excelencia técnica.* 💡
