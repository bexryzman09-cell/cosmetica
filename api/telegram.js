export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const text = String((req.body || {}).text || '').slice(0, 3500);
    if (!text) return res.status(400).json({ error: 'Bad request' });

    const bots = [
        { token: process.env.TG_TOKEN_1, chatId: process.env.TG_CHAT_1 },
        { token: process.env.TG_TOKEN_2, chatId: process.env.TG_CHAT_2 },
    ]
        .map((b) => ({ token: (b.token || '').trim(), chatId: (b.chatId || '').trim() }))
        .filter((b) => b.token && b.chatId);

    if (!bots.length) return res.status(500).json({ error: 'Telegram is not configured' });

    const results = await Promise.allSettled(
        bots.map(async (bot, i) => {
            const r = await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: bot.chatId, parse_mode: 'HTML', text }),
            });
            if (!r.ok) {
                const d = await r.json().catch(() => ({}));
                console.error(`Telegram, бот №${i + 1}: ${r.status} ${d.description || ''}`);
            }
            return r.ok;
        })
    );

    const ok = results.some((r) => r.status === 'fulfilled' && r.value);
    return res.status(ok ? 200 : 502).json({ ok });
}