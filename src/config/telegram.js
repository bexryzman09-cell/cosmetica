/** Экранируем пользовательский ввод — сообщения идут с parse_mode: HTML */
export const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Отправляет текст через серверную функцию. true — если хотя бы один бот отправил. */
export async function sendToBots(text) {
  const res = await fetch('/api/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.ok;
}