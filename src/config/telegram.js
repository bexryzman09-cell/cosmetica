// Токены берутся из .env (см. .env.example). В код их не вписываем.
export const BOTS = [
  { token: import.meta.env.VITE_TG_TOKEN_1, chatId: import.meta.env.VITE_TG_CHAT_1 },
  { token: import.meta.env.VITE_TG_TOKEN_2, chatId: import.meta.env.VITE_TG_CHAT_2 },
]
  .map((b) => ({ token: (b.token || '').trim(), chatId: String(b.chatId || '').trim() }))
  .filter((b) => b.token && b.chatId);

/** Экранируем пользовательский ввод — сообщения идут с parse_mode: HTML */
export const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Отправляет текст всем ботам. true — если хотя бы один отправил. */
export async function sendToBots(text) {
  const results = await Promise.allSettled(
    BOTS.map(async (bot, i) => {
      const res = await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: bot.chatId, parse_mode: 'HTML', text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // причина ошибки от Telegram (токен в сообщение не попадает)
        console.error(`Telegram, бот №${i + 1}: ${res.status} ${data.description || ''}`);
      }
      return res;
    })
  );
  return results.some((r) => r.status === 'fulfilled' && r.value.ok);
}