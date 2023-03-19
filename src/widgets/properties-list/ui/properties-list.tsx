import { useMediaQuery } from '@chakra-ui/react'
import { type FC } from 'react'
import { PropertiesTable } from '~/widgets/properties-list/ui/properties-table'
import { api } from '~/shared/api'

export const PropertiesList: FC = () => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 48rem)')
  const { data } = api.property.getMany.useQuery()

  return <>{isLargerThanMd && <PropertiesTable items={data} />}</>
}
