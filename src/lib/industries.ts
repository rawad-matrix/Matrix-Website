// "Industries We Serve" cards on the System Integrator page — admin-managed
// list (add/remove/edit from /admin/content), stored as one JSON blob in
// site_settings so no schema change is needed.

export type IndustryItem = { id: string; title: string; imageUrl: string | null }

export const INDUSTRIES_SETTINGS_KEY = 'si_industries'

export const DEFAULT_INDUSTRIES: IndustryItem[] = [
  { id: 'water',         title: 'Water & Wastewater',  imageUrl: null },
  { id: 'food',          title: 'Food & Beverage',     imageUrl: null },
  { id: 'pharma',        title: 'Pharmaceuticals',     imageUrl: null },
  { id: 'oilgas',        title: 'Oil & Gas',           imageUrl: null },
  { id: 'power',         title: 'Power Generation',    imageUrl: null },
  { id: 'building',      title: 'Building Automation', imageUrl: null },
  { id: 'manufacturing', title: 'Manufacturing',       imageUrl: null },
  { id: 'packaging',     title: 'Packaging',           imageUrl: null },
  { id: 'mining',        title: 'Mining & Quarrying',  imageUrl: null },
]

function makeId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function parseIndustries(json?: string | null): IndustryItem[] {
  if (!json) return DEFAULT_INDUSTRIES
  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_INDUSTRIES
    return parsed
      .filter((x): x is Partial<IndustryItem> => !!x && typeof x.title === 'string')
      .map((x) => ({ id: x.id ?? makeId(), title: x.title as string, imageUrl: x.imageUrl ?? null }))
  } catch {
    return DEFAULT_INDUSTRIES
  }
}
