import { VStack } from '@chakra-ui/react'
import { type FC } from 'react'
import { PropertyCard } from '~/widgets/properties-list/ui/property-card'
import { type RouterOutputs } from '~/shared/api/api'

type PropertiesCardsProps = {
  items: RouterOutputs['property']['getMany'] | undefined
}

export const PropertiesCards: FC<PropertiesCardsProps> = ({ items }) => {
  return (
    <VStack spacing={6}>
      {items &&
        items.map((item) => {
          return <PropertyCard key={item.id} item={item} />
        })}
    </VStack>
  )
}
