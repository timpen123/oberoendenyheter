/**
 * Formatera datum för visning (t.ex. "11 feb 12:00").
 */
export function formatArticleDate(iso: string | null): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${hours}:${minutes}`;
  } catch {
    return "";
  }
}
