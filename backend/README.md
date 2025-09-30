# Backend

Servidor Node (Express) con endpoint para generar planes de estudio.

## Endpoints

- GET `/health`: prueba de vida.
- POST `/plan`: genera un plan a partir de `{ objective, level, hoursPerWeek, weeks }`.
  - Usa OpenAI si `OPENAI_API_KEY` está configurada; si no, devuelve un plan simulado.

## Ejecutar en local

1. Copia variables:

```
cp backend/.env.example backend/.env
```

2. Edita `backend/.env`:

- `OPENAI_API_KEY=` (opcional)
- `PORT=5050`

3. Instala y arranca:

```
cd backend
npm install
npm start
```

Servidor: http://localhost:5050

## Integración Frontend

- En desarrollo, el frontend usa `REACT_APP_API_BASE_URL=http://localhost:5050`.
- En producción, define `REACT_APP_API_BASE_URL` con el origen del backend (o configura reverse proxy en el hosting).

## Notas de seguridad

- No subas tu `OPENAI_API_KEY` al repo.
- Restringe CORS por dominio en producción.
