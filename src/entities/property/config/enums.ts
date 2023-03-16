export const PropertyType = {
  Own: 'OWN',
  Managed: 'MANAGED',
} as const
export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType]

export const PropertyStatus = {
  Rented: 'RENTED',
  NotRented: 'NOT_RENTED',
  NotAvailable: 'NOT_AVAILABLE',
} as const
export type PropertyStatus =
  (typeof PropertyStatus)[keyof typeof PropertyStatus]
