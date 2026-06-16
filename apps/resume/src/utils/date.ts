export function formatYearMonth(dateStr: string | null, isCurrent = false, isEnd = false): string {
  if (isCurrent && isEnd) return '현재';
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  return `${year}.${month}`;
}

export function formatPeriod(startDate: string | null, endDate: string | null, isCurrent: boolean): string {
  const start = formatYearMonth(startDate);
  const end = isCurrent ? '현재' : formatYearMonth(endDate);
  if (!start && !end) return '';
  return `${start} - ${end}`;
}
