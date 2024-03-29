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
import { type RouterOutputs } from '~/shared/api/api'

type PropertiesTableProps = {
  items: RouterOutputs['property']['getMany'] | undefined
}

export const PropertiesTable: FC<PropertiesTableProps> = ({ items }) => {
  const { t } = useTranslation()

  return (
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
          {items &&
            items.map(
              ({
                id,
                name,
                status,
                unregisteredOwnerName,
                registeredOwnerName,
                managerName,
              }) => {
                return (
                  <Tr key={id}>
                    <Td>{name}</Td>
                    <Td>
                      <PropertyStatus status={status} />
                    </Td>
                    <Td>
                      {unregisteredOwnerName || registeredOwnerName || '-'}
                    </Td>
                    <Td>{managerName || '-'}</Td>
                  </Tr>
                )
              }
            )}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
