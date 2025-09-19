export function generateId(prefix = "ID"): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function parseDateOrUndefined(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? undefined : d;
}
