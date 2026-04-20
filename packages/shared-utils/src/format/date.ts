import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format an ISO date string for display.
 */
export function formatDate(
  dateStr: string | Date,
  pattern: string = 'MMM d, yyyy',
): string {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return '—';
  return format(date, pattern);
}

/**
 * Format a date as relative time (e.g. "3 days ago").
 */
export function formatRelativeTime(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return '—';
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format an ISO date string for datetime attributes.
 */
export function formatDateTimeAttr(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return '';
  return date.toISOString();
}