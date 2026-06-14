import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only plugin: run the Vercel-style serverless functions in `api/*.js`
 * under `vite dev`, so `npm run dev` behaves like the deployed Vercel site
 * (same-origin `/api/...`). `apply: 'serve'` keeps it out of production builds —
 * on Vercel the `/api` functions are served by the platform, not by this.
 */
function apiDevServer(env: Record<string, string>): Plugin {
  return {
    name: 'api-dev-server',
    apply: 'serve',
    configureServer(server) {
      // Expose server-side env vars (the non-VITE_ ones) to the handlers, which
      // read them via process.env. Vite does not load these into process.env itself.
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined) process.env[k] = v;
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();

        const route = req.url.split('?')[0].replace(/\/+$/, '').slice('/api/'.length);
        // Only allow simple file names (no path traversal)
        if (!/^[a-z0-9-]+$/i.test(route)) return next();

        try {
          const mod = await server.ssrLoadModule(`/api/${route}.js`);
          const handler = mod.default;
          if (typeof handler !== 'function') return next();

          // Collect + JSON-parse the request body (Vercel does this automatically)
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const raw = Buffer.concat(chunks).toString('utf8');
          (req as unknown as { body: unknown }).body = raw ? JSON.parse(raw) : {};

          // Shim the Vercel response helpers (res.status().json() / .send())
          const r = res as unknown as {
            status: (c: number) => typeof res;
            json: (o: unknown) => typeof res;
            send: (d: unknown) => void;
          };
          r.status = (code: number) => {
            res.statusCode = code;
            return res;
          };
          r.json = (obj: unknown) => {
            if (!res.headersSent) res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(obj));
            return res;
          };
          r.send = (data: unknown) =>
            res.end(typeof data === 'string' ? data : JSON.stringify(data));

          await handler(req, res);
        } catch (err) {
          console.error('[api-dev-server] error:', err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Dev API error' }));
          }
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // '' prefix => load ALL env vars (including non-VITE_ server secrets) from .env files
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), apiDevServer(env)],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
