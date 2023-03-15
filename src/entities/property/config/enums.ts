export const PropertyFilterTypes = ['Own', 'Managed'] as const
export type PropertyFiltersType = (typeof PropertyFilterTypes)[number]

export const PropertyFilterStatuses = [
  'Rented',
  'NotRented',
  'NotAvailable',
] as const
export type PropertyFilterStatus = (typeof PropertyFilterStatuses)[number]
