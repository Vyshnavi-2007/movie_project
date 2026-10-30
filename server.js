/**
 * Premier Entertainer Portal - JSON Server Backend Entry Point
 * Designed for deployment on Render (or local execution).
 * Binds to 0.0.0.0 and dynamically respects process.env.PORT.
 * Enables CORS so frontend hosted on Netlify can interact seamlessly.
 */

import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));

// Enable CORS and standard json-server middlewares
const middlewares = jsonServer.defaults({
  cors: true,
  noCache: true,
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

server.use(middlewares);
server.use(router);

server.listen(PORT, HOST, () => {
  console.log(`[Backend] JSON Server is live and listening on http://${HOST}:${PORT}`);
  console.log(`[Backend] Movies endpoint: http://${HOST}:${PORT}/movies`);
  console.log(`[Backend] Genres endpoint: http://${HOST}:${PORT}/genres`);
  console.log(`[Backend] Reviews endpoint: http://${HOST}:${PORT}/reviews`);
});
