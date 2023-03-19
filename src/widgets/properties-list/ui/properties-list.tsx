import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { type FC } from 'react'
import { PropertyStatus } from '~/widgets/properties-list/ui/property-status'
import { api } from '~/shared/api'

export const PropertiesList: FC = () => {
  const { t } = useTranslation()
  const { data } = api.property.getMany.useQuery()

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('name')}</Th>
              <Th>{t('status')}</Th>
              <Th>{t('owner')}</Th>
              <Th>{t('manager')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map(({ id, name, status, ownerName, owner, manager }) => {
                return (
                  <Tr key={id}>
                    <Td>{name}</Td>
                    <Td>
                      <PropertyStatus status={status} />
                    </Td>
                    <Td>{ownerName || owner?.name || '-'}</Td>
                    <Td>{manager?.name || '-'}</Td>
                  </Tr>
                )
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
