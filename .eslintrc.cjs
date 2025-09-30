/** @type {import("eslint").Linter.Config} */
module.exports = {
  // Indica que esta es la configuración raíz de ESLint.
  root: true,

  // Entorno y configuraciones base que se aplican a todo el proyecto.
  env: {
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Asegura que Prettier y ESLint no entren en conflicto.
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  // La clave "overrides" nos permite aplicar configuraciones específicas
  // a subconjuntos de archivos basados en patrones de ruta.
  overrides: [
    // --- Configuración para el Frontend (React) ---
    {
      files: ['frontend/src/**/*.{js,jsx}'],
      env: {
        browser: true, // Variables globales del navegador (window, document, etc.)
        jest: true,
      },
      // Heredamos las reglas de Create React App, que es un estándar robusto.
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime', // Para el nuevo transform de JSX
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      settings: {
        react: {
          version: 'detect', // Detecta automáticamente la versión de React.
        },
      },
      // Reglas específicas para el frontend, tomadas de tu config original.
      rules: {
        'react/prop-types': 'off', // No es necesario con TypeScript o si no se usa.
        'react/react-in-jsx-scope': 'off', // No es necesario con el nuevo transform de JSX.
        'react-hooks/rules-of-hooks': 'error', // Regla crítica, debe ser un error.
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'jsx-a11y/anchor-is-valid': 'warn', // Permite enlaces sin href para React Router.
        // Puedes añadir aquí el resto de reglas que tenías en 'warn' si lo prefieres.
      },
    },

    // --- Configuración para el Backend (Node.js/Express) ---
    {
      files: ['backend/src/**/*.js'],
      env: {
        node: true, // Variables globales de Node.js (process, require, etc.)
      },
      // No necesita configuraciones de React.
      extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    },

    // --- Configuración para los tests del Backend ---
    {
      files: ['backend/src/**/*.test.js'],
      env: {
        node: true,
        jest: true,
      },
      extends: ['plugin:jest/recommended'],
    },
  ],
};
