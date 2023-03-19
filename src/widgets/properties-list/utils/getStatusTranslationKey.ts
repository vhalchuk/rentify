import { PropertyStatus } from '~/entities/property/config/enums'

export const getStatusTranslationKey = (status: PropertyStatus) => {
  switch (status) {
    case PropertyStatus.NotRented:
      return 'notRented'
    case PropertyStatus.Rented:
      return 'rented'
    default:
      return 'notAvailable'
  }
}
