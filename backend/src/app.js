// backend/src/app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Opcional si Render pone proxy delante
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(express.json({ limit: '1mb' }));

// Ajusta el/los origin a tu dominio real de Netlify
app.use(cors({
  origin: [
    'https://TU-FRONTEND.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Health check para Render
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// (Ejemplo) raíz simple opcional
app.get('/', (_req, res) => res.status(200).json({ status: 'up' }));

module.exports = app;
