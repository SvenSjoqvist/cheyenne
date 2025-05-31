import { ReadonlyURLSearchParams } from "next/navigation";

// utils.ts
export function ensureStartWith(stringToCheck: string | undefined, startsWith: string): string {
  if (!stringToCheck) {
    throw new Error('String to check is undefined');
  }
  return stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;
}
export function createUrl (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) {
    const paramsString = params.toString()
    const queryString = `${paramsString.length ? '?' : ''}${paramsString}`
    return `${pathname}${queryString}`
}

export function formatCurrency(amount: string | number, currencyCode: string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount);
} 