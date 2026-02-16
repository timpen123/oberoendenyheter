const WORDS_PER_MINUTE = 200;

function stripMarkup(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadTime(text: string): string {
  const plain = stripMarkup(text);
  if (!plain) return "1 min";

  const words = plain.split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min`;
}
