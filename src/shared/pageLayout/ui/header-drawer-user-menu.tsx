import { Box, Button, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { type FC, useState } from 'react'
import { Collapse } from 'react-collapse'
import { CgProfile, HiOutlineLogout, VscGlobe } from 'react-icons/all'
import { Locale } from '~/shared/types/locale'

export const HeaderDrawerUserMenu: FC = () => {
  const [openedSection, setOpenedSection] = useState<
    'user' | 'languages' | null
  >(null)
  const { t } = useTranslation('common')
  const { data: sessionData } = useSession()
  const router = useRouter()
  const accountTitle = sessionData?.user?.name || t('account')

  const createToggleHandler = (section: 'user' | 'languages') => () => {
    if (openedSection !== section) {
      setOpenedSection(section)
    } else {
      setOpenedSection(null)
    }
  }

  const switchToLocale = (locale: Locale) => {
    const path = router.asPath

    void router.push(path, path, { locale })
  }

  const selectedSectionButtonStyles = {
    backgroundColor: 'green.500',
    color: 'white',
  }

  const selectedLanguageButtonStyles = {
    backgroundColor: 'green.100',
    fontWeight: 'bold',
    color: 'green.700',
  }

  return (
    <>
      <HStack justifyContent="space-between" px={6} py={2}>
        <IconButton
          aria-label="Expand user menu"
          fontSize="24px"
          variant="unstyled"
          icon={<CgProfile />}
          onClick={createToggleHandler('user')}
          display="flex"
          {...(openedSection === 'user' ? selectedSectionButtonStyles : {})}
        />
        <IconButton
          aria-label="Expand languages menu"
          fontSize="24px"
          variant="unstyled"
          icon={<VscGlobe />}
          onClick={createToggleHandler('languages')}
          display="flex"
          {...(openedSection === 'languages'
            ? selectedSectionButtonStyles
            : {})}
        />
      </HStack>
      <Collapse isOpened={openedSection === 'user'}>
        <VStack
          backgroundColor="gray.50"
          px={6}
          py={4}
          spacing={3}
          align="start"
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="1rem">{accountTitle}</Text>
          <Button
            leftIcon={<HiOutlineLogout fontSize="20px" />}
            onClick={() => void signOut({ callbackUrl: '/' })}
            variant="unstyled"
            w="full"
            justifyContent="start"
            display="flex"
            textColor="gray.700"
          >
            {t('signOut')}
          </Button>
        </VStack>
      </Collapse>
      <Collapse isOpened={openedSection === 'languages'}>
        <Box
          backgroundColor="gray.50"
          px={2}
          py={3}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <Button
            leftIcon={<span>🇬🇧</span>}
            onClick={() => switchToLocale(Locale.En)}
            variant="unstyled"
            w="full"
            justifyContent="start"
            textColor="gray.700"
            display="flex"
            px={4}
            {...(router.locale === Locale.En
              ? selectedLanguageButtonStyles
              : {})}
          >
            {t('english')}
          </Button>
          <Button
            leftIcon={<span>🇺🇦</span>}
            onClick={() => switchToLocale(Locale.Uk)}
            variant="unstyled"
            w="full"
            justifyContent="start"
            textColor="gray.700"
            display="flex"
            px={4}
            {...(router.locale === Locale.Uk
              ? selectedLanguageButtonStyles
              : {})}
          >
            {t('ukrainian')}
          </Button>
        </Box>
      </Collapse>
    </>
  )
}
