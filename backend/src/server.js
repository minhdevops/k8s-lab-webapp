import express from 'express';
import cors from 'cors';
import os from 'os';

const app = express();
const port = process.env.PORT || 3000;
const appVersion = process.env.APP_VERSION || '1.0.0';

app.use(cors());
app.use(express.json());

const todos = [
  { id: 1, text: 'Build Docker images', done: true },
  { id: 2, text: 'Deploy with Kubernetes', done: false },
  { id: 3, text: 'Sync with Argo CD', done: false }
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend', version: appVersion });
});

app.get('/api/info', (_req, res) => {
  res.json({
    message: 'Hello from backend API',
    hostname: os.hostname(),
    version: appVersion,
    time: new Date().toISOString()
  });
});

app.get('/api/todos', (_req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (!text) return res.status(400).json({ error: 'text is required' });

  const todo = { id: Date.now(), text, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
