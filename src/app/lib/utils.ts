import { ReadonlyURLSearchParams } from "next/navigation";

export function ensureStartWith(stringtocheck: string, startswith: string): string {
    return stringtocheck.startsWith(startswith) ? stringtocheck : `${startswith}${stringtocheck}`;
  }
export function createUrl (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) {
    const paramsString = params.toString()
    const queryString = `${paramsString.length ? '?' : ''}${paramsString}`
    return `${pathname}${queryString}`
}