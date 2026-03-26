export const TEAM_COLORS = {
  platform: { bg: '#dbeafe', text: '#1d4ed8' },
  product: { bg: '#ede9fe', text: '#6d28d9' },
};

export const PRIORITY_COLORS = {
  now: { bg: '#fee2e2', text: '#b91c1c' },
  later: { bg: '#dcfce7', text: '#15803d' },
};

export const EFFORT_COLORS = {
  large: { bg: '#f3f4f6', text: '#374151' },
  medium: { bg: '#f3f4f6', text: '#374151' },
  small: { bg: '#f3f4f6', text: '#374151' },
};

export function timeSince(date) {
  if (!date) return null;
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
}
