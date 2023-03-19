import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { type FC } from 'react'
import { Collapse } from 'react-collapse'
import {
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
  HiOutlineChevronRight,
} from 'react-icons/all'
import { getStatusTranslationKey } from '~/widgets/properties-list/utils/getStatusTranslationKey'
import { PropertyStatus } from '~/entities/property/config/enums'
import { type RouterOutputs } from '~/shared/api/api'

type PropertyCardProps = {
  item: RouterOutputs['property']['getMany'][number]
}

export const PropertyCard: FC<PropertyCardProps> = ({
  item: { name, status, ownerName, owner, manager },
}) => {
  const { t } = useTranslation('common')
  const { isOpen, onToggle } = useDisclosure()

  let bgColor: string

  if (status === PropertyStatus.NotRented) {
    bgColor = 'orange.100'
  } else if (status === PropertyStatus.Rented) {
    bgColor = 'green.100'
  } else {
    bgColor = 'red.100'
  }

  return (
    <Card maxW="320px" width="full" backgroundColor={bgColor} fontSize="1rem">
      <CardHeader>
        <Heading fontSize="1.25rem">{name}</Heading>
      </CardHeader>
      <CardBody py={2}>
        <Stack>
          <Flex justifyContent="space-between" flexGrow={1}>
            <span>{t('status')}</span>
            <Text fontWeight="bold">{t(getStatusTranslationKey(status))}</Text>
          </Flex>
          <Collapse isOpened={isOpen}>
            <Stack>
              <Flex justifyContent="space-between" flexGrow={1}>
                <span>{t('owner')}</span>
                <Text fontWeight="bold">{ownerName || owner?.name || '-'}</Text>
              </Flex>
              <Flex justifyContent="space-between" flexGrow={1}>
                <span>{t('manager')}</span>
                <Text fontWeight="bold">{manager?.name || '-'}</Text>
              </Flex>
            </Stack>
          </Collapse>
        </Stack>
      </CardBody>
      <CardFooter pt={2}>
        <Grid
          templateAreas={`"actions collapse goto"`}
          gridTemplateColumns={'1fr 1fr 1fr'}
          gap="1"
          w="full"
        >
          <GridItem
            area={'collapse'}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              aria-label="Toggle collapse card"
              onClick={onToggle}
              variant="unstyled"
              display="flex"
              icon={
                isOpen ? (
                  <HiOutlineChevronDoubleUp />
                ) : (
                  <HiOutlineChevronDoubleDown />
                )
              }
            />
          </GridItem>
          <GridItem
            area={'goto'}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
          >
            Go to
            <HiOutlineChevronRight />
          </GridItem>
        </Grid>
      </CardFooter>
    </Card>
  )
}
