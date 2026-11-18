import type { ISODate, ISODateTime } from '../types';

/** The UI copy is English, so dates and numbers follow it rather than the device locale. */
export const LOCALE = 'en-US';

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Local calendar date of a Date or ISO timestamp. */
export function toISODate(value: Date | ISODateTime): ISODate {
  const d = typeof value === 'string' ? new Date(value) : value;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseISODate(date: ISODate): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: ISODate, amount: number): ISODate {
  const d = parseISODate(date);
  d.setDate(d.getDate() + amount);
  return toISODate(d);
}

/** Whole calendar days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: ISODate, to: ISODate): number {
  const ms = parseISODate(to).getTime() - parseISODate(from).getTime();
  return Math.round(ms / 86_400_000);
}

/** 0 = Monday … 6 = Sunday. */
export function weekdayIndex(date: ISODate): number {
  return (parseISODate(date).getDay() + 6) % 7;
}

function toDate(value: ISODate | ISODateTime): Date {
  return value.length === 10 ? parseISODate(value) : new Date(value);
}

export function formatShortDate(value: ISODate | ISODateTime): string {
  return toDate(value).toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' });
}

export function formatLongDate(value: ISODate | ISODateTime): string {
  return toDate(value).toLocaleDateString(LOCALE, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatMonth(value: ISODate): string {
  return toDate(value).toLocaleDateString(LOCALE, { month: 'short' });
}

export function formatDateTime(value: ISODateTime): string {
  return new Date(value).toLocaleString(LOCALE, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
