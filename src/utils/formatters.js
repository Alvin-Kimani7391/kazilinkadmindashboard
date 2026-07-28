/**
 * Firestore returns Timestamp objects (with a .toDate() method) for date
 * fields, but a doc can also occasionally hold a raw JS Date, an ISO string,
 * or be missing entirely (e.g. serverTimestamp() hasn't resolved yet on a
 * doc that was just optimistically added). This normalizes all of those
 * into a safe display string instead of throwing or rendering "Invalid Date".
 */
export const formatDate = (value, options = { year: 'numeric', month: 'short', day: 'numeric' }) => {
  if (!value) return '—';
  try {
    const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString(undefined, options);
  } catch {
    return '—';
  }
};

export const formatDateTime = (value) =>
  formatDate(value, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

/**
 * Lightweight "2 min ago" / "3 hours ago" formatter for activity feeds.
 */
export const timeAgo = (value) => {
  if (!value) return '—';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return formatDate(value);
};