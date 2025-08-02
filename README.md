# 🎨 SIVIGILA Portal - Frontend

## 📋 Descripción General

**SIVIGILA Portal Frontend** es la interfaz de usuario moderna y responsiva del sistema de vigilancia epidemiológica de la Secretaría Distrital de Salud de Cali. Construido con **React 18**, **TypeScript** y **Vite**, proporciona una experiencia de usuario intuitiva y eficiente para la gestión de instituciones de salud y caracterizaciones epidemiológicas.

### 🎯 Propósito

Esta aplicación frontend permite:
- **Gestión Visual**: Interface moderna para el directorio de 318+ instituciones
- **Roles Diferenciados**: Experiencias personalizadas para ADMIN y UPGD_UI
- **Carga Masiva**: Upload intuitivo de archivos Excel con progreso visual
- **Tablas Avanzadas**: Paginación, ordenamiento y filtrado en tiempo real
- **Dashboard Interactivo**: Estadísticas y métricas visuales

---

## 🛠️ Stack Tecnológico

### Core Framework
- **[React](https://reactjs.org/)** `^18.2.0` - Librería de UI con Hooks
- **[TypeScript](https://www.typescriptlang.org/)** `^5.0.2` - Superset tipado de JavaScript
- **[Vite](https://vitejs.dev/)** `^4.4.5` - Build tool ultrarrápido

### Estado y Contexto
- **React Context API** - Gestión de estado global (AuthContext)
- **React Hooks** - useState, useEffect, useContext, hooks personalizados
- **Local Storage** - Persistencia de autenticación

### Estilos y UI
- **CSS Modules** - Estilos encapsulados por componente
- **CSS Custom Properties** - Variables CSS para theming
- **Responsive Design** - Diseño adaptativo para todos los dispositivos
- **Modern CSS** - Flexbox, Grid, Animations

### Networking
- **Fetch API** - Comunicación HTTP nativa
- **Custom Services** - Abstracción de API calls
- **Error Handling** - Manejo centralizado de errores HTTP

### Desarrollo
- **[ESLint](https://eslint.org/)** - Linting con reglas personalizadas
- **[@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react)** - Plugin React para Vite
- **[TypeScript ESLint](https://typescript-eslint.io/)** - Linting específico para TypeScript

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── 📁 assets/           # Recursos estáticos
│   └── react.svg        # Iconos y gráficos
│
├── 📁 components/       # Componentes reutilizables
│   ├── 📁 auth/         # Componentes de autenticación
│   │   ├── LoginForm.tsx       # Formulario de login
│   │   └── logo.png           # Logo de la aplicación
│   │
│   ├── 📁 Characterization/   # Componentes de caracterizaciones
│   │   ├── FileModal.tsx      # Modal de archivos
│   │   ├── FileTable.tsx      # Tabla de archivos
│   │   └── UploadForm.tsx     # Formulario de carga
│   │
│   ├── 📁 common/       # Componentes compartidos
│   │   ├── DataTableModal.tsx # Modal de tabla de datos
│   │   ├── LoadingSpinner.tsx # Spinner de carga
│   │   └── Pagination.tsx     # Componente de paginación
│   │
│   ├── 📁 Directory/    # Componentes del directorio
│   │   └── DirectoryTable.tsx # Tabla principal del directorio
│   │
│   └── 📁 layout/       # Componentes de layout
│       ├── Navbar.tsx   # Barra de navegación
│       └── Layout.tsx   # Layout principal
│
├── 📁 contexts/         # Contextos de React
│   └── AuthContext.tsx # Contexto de autenticación
│
├── 📁 hooks/           # Hooks personalizados
│   └── useAuth.ts      # Hook de autenticación
│
├── 📁 pages/           # Páginas principales
│   ├── Characterization.tsx  # Página de caracterizaciones
│   ├── Dashboard.tsx         # Dashboard principal
│   ├── Login.tsx             # Página de login
│   └── DirectorioInstitucional.tsx # Página del directorio
│
├── 📁 services/        # Servicios de API
│   ├── auth.service.ts           # Servicio de autenticación
│   ├── characterization.service.ts # Servicio de caracterizaciones
│   └── directory.service.ts      # Servicio del directorio
│
├── 📁 styles/          # Estilos CSS
│   ├── characterization.css     # Estilos de caracterizaciones
│   ├── Dashboard.css            # Estilos del dashboard
│   ├── LoginForm.css            # Estilos del login
│   └── Navbar.css               # Estilos de navegación
│
├── 📁 types/           # Definiciones de tipos TypeScript
│   ├── api.ts                   # Tipos de respuestas API
│   ├── auth.ts                  # Tipos de autenticación
│   ├── characterization.types.ts # Tipos de caracterizaciones
│   └── directory.types.ts       # Tipos del directorio
│
├── 📁 utils/           # Utilidades y helpers
│   └── helpers.ts      # Funciones auxiliares
│
├── App.tsx             # Componente raíz
├── App.css             # Estilos globales
├── main.tsx            # Punto de entrada
├── index.css           # Estilos base
├── theme.ts            # Configuración de tema
└── vite-env.d.ts       # Tipos de Vite
```

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
