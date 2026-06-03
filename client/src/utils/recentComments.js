/** Returns the newest `limit` comments in chronological order (oldest first). */
export function recentComments(comments, limit = 2) {
  if (!comments?.length) return [];
  return [...comments]
    .sort((a, b) => Number(a.createdAt) - Number(b.createdAt))
    .slice(-limit);
}
