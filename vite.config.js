import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_TMDB_API_KEY || '3fd2be6f0c70a2a598f084ddfb75487c';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/tmdb': {
          target: 'https://api.tmdb.org/3',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const url = new URL(proxyReq.path, 'https://api.tmdb.org');
              if (!url.searchParams.has('api_key') && apiKey) {
                url.searchParams.set('api_key', apiKey);
                proxyReq.path = url.pathname + url.search;
              }
            });
          },
        },
      },
    },
  };
});
