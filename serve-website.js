import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'website')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'website', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Website showcase running at http://0.0.0.0:${PORT}`);
});
