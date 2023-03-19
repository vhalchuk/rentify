import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { type FC } from 'react'
import { getStatusTranslationKey } from '~/widgets/properties-list/utils/getStatusTranslationKey'
import { PropertyStatus as PropertyStatusEnum } from '~/entities/property/config/enums'

type PropertyStatusProps = {
  status: PropertyStatusEnum
}

export const PropertyStatus: FC<PropertyStatusProps> = ({ status }) => {
  const { t } = useTranslation('common')
  let backgroundColor

  if (status === PropertyStatusEnum.NotRented) {
    backgroundColor = 'orange.300'
  } else if (status === PropertyStatusEnum.Rented) {
    backgroundColor = 'green.300'
  } else {
    backgroundColor = 'red.300'
  }

  return (
    <Flex fontSize="1rem" alignItems="center" gap={2}>
      <Box
        as="span"
        display="inline-block"
        rounded="full"
        height="20px"
        width="20px"
        backgroundColor={backgroundColor}
      />
      {t(getStatusTranslationKey(status))}
    </Flex>
  )
}
