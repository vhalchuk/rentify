export const PropertyFilterTypes = ['OWN', 'MANAGED'] as const
export type PropertyFiltersType = (typeof PropertyFilterTypes)[number]

export const PropertyFilterStatuses = [
  'RENTED',
  'NOT_RENTED',
  'NOT_AVAILABLE',
] as const
export type PropertyFilterStatus = (typeof PropertyFilterStatuses)[number]
