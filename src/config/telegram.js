// Токены берутся из .env (см. .env.example). В код их не вписываем.
export const BOTS = [
  { token: import.meta.env.VITE_TG_TOKEN_1, chatId: import.meta.env.VITE_TG_CHAT_1 },
  { token: import.meta.env.VITE_TG_TOKEN_2, chatId: import.meta.env.VITE_TG_CHAT_2 },
].filter((b) => b.token && b.chatId);

/** Экранируем пользовательский ввод — сообщения идут с parse_mode: html */
export const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Отправляет текст всем ботам. true — если хотя бы один отправил. */
export async function sendToBots(text) {
  const results = await Promise.allSettled(
    BOTS.map((bot) =>
      fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: bot.chatId, parse_mode: 'html', text }),
      })
    )
  );
  return results.some((r) => r.status === 'fulfilled' && r.value.ok);
}
