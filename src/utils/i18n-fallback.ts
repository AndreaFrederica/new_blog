export type Locale = string

export interface LocaleChainOptions {
  defaultLocale?: Locale
  fallbacks?: Record<Locale, Locale[]>
}

// Build the language search chain for a given locale.
// The chain ends with 'origin' to indicate the original language file.
export function getLocaleChain(locale: Locale, opts?: LocaleChainOptions): Locale[] {
  const seen = new Set<Locale>()
  const chain: Locale[] = []

  const push = (l?: Locale) => {
    if (!l) return
    if (!seen.has(l)) {
      seen.add(l)
      chain.push(l)
    }
  }

  push(locale)
  const fb = opts?.fallbacks?.[locale] ?? []
  for (const l of fb) push(l)
  // defaultLocale can be part of the order if you want it
  push(opts?.defaultLocale)
  // Use 'origin' as the final fallback (file without lang suffix)
  push('origin')

  return chain
}

// Pick the best localized entry from a set of entries in the same group.
// - Original language: entry.data.lang missing or 'origin'
// - Translations: entry.data.lang like 'en', 'zh', 'ja', etc.
export function chooseOneLocalized<T extends { id: string; slug?: string; data?: any }>(
  sameGroupEntries: T[],
  wantedLocale: Locale,
  opts?: LocaleChainOptions
): T | undefined {
  const chain = getLocaleChain(wantedLocale, opts)

  const byLang = new Map<Locale, T[]>()
  let origin: T[] = []

  for (const e of sameGroupEntries) {
    const lang = inferEntryLang(e)
    if (!lang || lang === 'origin') origin.push(e)
    else {
      if (!byLang.has(lang)) byLang.set(lang, [])
      byLang.get(lang)!.push(e)
    }
  }

  for (const l of chain) {
    if (l === 'origin') return origin[0]
    const c = byLang.get(l)
    if (c?.length) return c[0]
  }

  return sameGroupEntries[0]
}

// From a list of entries across multiple groups, keep the best one per group.
export function pickLocalized<T extends { id: string; slug?: string; data?: any }>(
  entries: T[],
  wantedLocale: Locale,
  groupKey: (e: T) => string,
  opts?: LocaleChainOptions
): (e: T) => boolean {
  const chain = getLocaleChain(wantedLocale, opts)

  // Group entries by post key
  const groups = new Map<string, T[]>()
  for (const e of entries) {
    const key = groupKey(e)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(e)
  }

  const bestIds = new Set<string>()

  for (const [, list] of groups) {
    const byLang = new Map<Locale, T[]>()
    let origin: T[] = []

    for (const e of list) {
      const lang = inferEntryLang(e)
      if (!lang || lang === 'origin') origin.push(e)
      else {
        if (!byLang.has(lang)) byLang.set(lang, [])
        byLang.get(lang)!.push(e)
      }
    }

    let chosen: T | undefined
    for (const l of chain) {
      if (l === 'origin') {
        chosen = origin[0]
      } else {
        const c = byLang.get(l)
        if (c?.length) chosen = c[0]
      }
      if (chosen) break
    }

    if (!chosen) chosen = list[0]
    if (chosen?.id) bestIds.add(chosen.id)
  }

  return (e: T) => bestIds.has(e.id)
}

// Derive a stable group key from a slug: 'guide/index' -> 'guide'
export function groupKeyFromSlug(slug: string): string {
  const parts = slug.split('/')
  return parts.slice(0, -1).join('/')
}

// Try to infer language of an entry:
// 1) data.lang if provided
// 2) from slug: 'index.ja' -> 'ja', 'index.zh-cn' -> 'zh-cn'
// 3) else undefined (treated as 'origin')
export function inferEntryLang<T extends { slug?: string; data?: any }>(e: T): Locale | undefined {
  const fm = e?.data?.lang as Locale | undefined
  if (fm) return fm
  const slug = e?.slug
  if (!slug) return undefined
  const m = slug.match(/\.([A-Za-z]{2}(?:[-_][A-Za-z]{2})?)$/)
  return m ? m[1].toLowerCase() : undefined
}
