import en from '../locales/en/common.json'
import ar from '../locales/ar/common.json'
export type Lang = 'en' | 'ar'
const dicts: Record<Lang, unknown> = { en, ar }
function lookup(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k]
    return undefined
  }, obj)
}
export function tr(lang: Lang, path: string): string {
  const v = lookup(dicts[lang], path)
  return typeof v === 'string' ? v : path
}
export function trArr(lang: Lang, path: string): string[] {
  const v = lookup(dicts[lang], path)
  return Array.isArray(v) ? (v as string[]) : []
}
export function trObjArr<T>(lang: Lang, path: string): T[] {
  const v = lookup(dicts[lang], path)
  return Array.isArray(v) ? (v as T[]) : []
}
export const LANG_KEY = 'lang'
