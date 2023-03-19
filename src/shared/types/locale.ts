export const Locale = {
  En: 'en',
  Uk: 'uk',
}
export type Locale = (typeof Locale)[keyof typeof Locale]

export type WithLocale<T extends Record<string, unknown>> = T & {
  locale: Locale
}
