export function getOrdefault(token: string, defaultValue: number): number;
export function getOrdefault(token: string, defaultValue: string): string;
export function getOrdefault(
  token: string,
  defaultValue: number | string,
): number | string {
  const value = process.env[token] || defaultValue;
  if (typeof defaultValue === 'number') {
    return Number(value);
  }
  return value;
}
