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