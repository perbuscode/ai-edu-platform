import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { makeOpenAIClient, generateStudyPlan } from './openaiPlan.js';
import { getFirestoreSafe, verifyIdTokenOptional } from './firebaseAdmin.js';

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.post('/plan', async (req, res) => {
  try {
    const { objective, level, hoursPerWeek, weeks } = req.body || {};

    // Validación explícita del payload con mensajes claros
    const problems = [];
    if (typeof objective !== 'string' || objective.trim() === '') problems.push('objective (string no vacío)');
    if (typeof level !== 'string' || level.trim() === '') problems.push('level (string no vacío)');
    const hpw = Number(hoursPerWeek);
    if (!Number.isFinite(hpw) || hpw <= 0) problems.push('hoursPerWeek (número > 0)');
    const wks = Number(weeks);
    if (!Number.isFinite(wks) || wks <= 0 || !Number.isInteger(wks)) problems.push('weeks (entero > 0)');
    if (problems.length) {
      const errorId = Date.now().toString(36);
      console.warn(`[POST /plan][${errorId}] Validación fallida: ${problems.join(', ')}`);
      return res.status(400).json({ error: `Payload inválido: ${problems.join('; ')}`, errorId });
    }

    let plan;
    if (process.env.MOCK_PLAN === '1' || (req.query && req.query.mock === '1') || req.headers['mock'] === '1' || req.headers['x-mock'] === '1') {
      if ((req.query && req.query.mock === '1') || req.headers['mock'] === '1' || req.headers['x-mock'] === '1') {
        console.info('[POST /plan] mock solicitado (query/header)');
      }
      plan = {
        title: `${objective} (Nivel ${level}) - ${weeks} semanas`,
        goal: objective,
        level,
        hoursPerWeek: Number(hoursPerWeek),
        durationWeeks: Number(weeks),
        blocks: [
          { title: 'Fundamentos', bullets: ['Intro', 'Herramientas', 'Buenas prácticas'], project: 'Proyecto 1', role: 'Jr.' },
          { title: 'Profundización', bullets: ['Conceptos clave', 'Práctica guiada'], project: 'Proyecto 2', role: 'Mid' }
        ],
        rubric: [
          { criterion: 'Comprensión de conceptos', level: 'A/B/C' },
          { criterion: 'Aplicación práctica', level: 'A/B/C' },
        ],
      };
    } else {
      try {
        const client = makeOpenAIClient(process.env.OPENAI_API_KEY);
        plan = await generateStudyPlan({ client, input: { objective, level, hoursPerWeek, weeks } });
      } catch (err) {
        // Fallback: si falla proveedor y MOCK_PLAN=1 en env, devolvemos mock (200)
    if (process.env.MOCK_PLAN === '1' || !process.env.OPENAI_API_KEY) {
          const errorId = Date.now().toString(36);
          const httpStatus = (err && (err.status ?? err.statusCode ?? err.response?.status ?? err.response?.statusCode)) || undefined;
          console.warn(`[POST /plan][${errorId}] OpenAI falló, devolviendo mock por MOCK_PLAN=1`, {
            message: err?.message || String(err),
            httpStatus,
          });
          plan = {
            title: `${objective} (Nivel ${level}) - ${weeks} semanas`,
            goal: objective,
            level,
            hoursPerWeek: Number(hoursPerWeek),
            durationWeeks: Number(weeks),
            blocks: [
              { title: 'Fundamentos', bullets: ['Intro'], project: 'Proyecto mock', role: 'Jr.' }
            ],
            rubric: [
              { criterion: 'Entendimiento', level: 'A/B/C' }
            ],
          };
        } else {
          throw err;
        }
      }
    }

    // Try to extract user via Firebase token
    const authz = req.headers['authorization'];
    const decoded = await verifyIdTokenOptional(authz);
    if (decoded?.uid) {
      const db = getFirestoreSafe();
      if (db) {
        const uid = decoded.uid;
        const ref = db.collection('users').doc(uid).collection('plans').doc();
        const stored = {
          plan,
          objective,
          level,
          hoursPerWeek: Number(hoursPerWeek),
          weeks: Number(weeks),
          createdAt: new Date().toISOString(),
        };
        await ref.set(stored);
        plan._id = ref.id;
      }
    }

    res.json({ plan });
  } catch (e) {
    const errorId = Date.now().toString(36);
    const httpStatus = (e && (e.status ?? e.statusCode ?? e.response?.status ?? e.response?.statusCode)) || undefined;
    const name = e?.name || 'Error';
    const message = e?.message || String(e);
    const stack = e?.stack;
    console.error(`[POST /plan][${errorId}] Error al generar plan`, {
      name,
      message,
      httpStatus,
      stack,
    });
    res.status(500).json({ error: 'No se pudo generar el plan', errorId });
  }
});

// Export app for testing
export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[backend] Escuchando en http://localhost:${PORT}`);
  });
}
