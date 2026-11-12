import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Только для разработки: запускает api/chat.js прямо в Vite
function devApi() {
    return {
        name: 'dev-api',
        configureServer(server) {
            server.middlewares.use('/api/chat', async (req, res) => {
                let raw = '';
                for await (const chunk of req) raw += chunk;
                try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }

                res.status = (code) => { res.statusCode = code; return res; };
                res.json = (obj) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(obj));
                };

                try {
                    const mod = await server.ssrLoadModule('/api/chat.js');
                    await mod.default(req, res);
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ error: 'Dev API error', detail: String(e && e.message ? e.message : e) });
                }
            });
        },
    };
}

export default defineConfig(({ mode }) => {
    // подхватываем AI_API_KEY из .env.local в окружение сервера
    const env = loadEnv(mode, process.cwd(), '');
    if (env.AI_API_KEY) process.env.AI_API_KEY = env.AI_API_KEY;
    if (env.AI_MODEL) process.env.AI_MODEL = env.AI_MODEL;

    return {
        plugins: [react(), devApi()],
    };
});