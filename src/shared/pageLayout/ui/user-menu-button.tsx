import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useColorModeValue,
} from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { type FC } from 'react'
import { CgProfile, HiOutlineLogout } from 'react-icons/all'
import { Locale } from '~/shared/types/locale'

export const UserMenuButton: FC = () => {
  const { data: sessionData } = useSession()
  const router = useRouter()
  const { t } = useTranslation('common')

  const switchToLocale = (locale: Locale) => {
    const path = router.asPath

    void router.push(path, path, { locale })
  }

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Open user menu"
        icon={<CgProfile />}
        color={useColorModeValue('gray.800', 'inherit')}
        fontSize="24px"
        variant="ghost"
        display={{ base: 'none', lg: 'flex' }}
      />
      <MenuList>
        <MenuGroup title={sessionData?.user?.name || t('account') || undefined}>
          <MenuItem
            icon={<HiOutlineLogout fontSize="20px" />}
            onClick={() => void signOut({ callbackUrl: '/' })}
          >
            {t('signOut')}
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuOptionGroup
          title={t('language') || undefined}
          defaultValue={router.locale || Locale.En}
        >
          <MenuItemOption
            value={Locale.En}
            onClick={() => switchToLocale(Locale.En)}
          >
            <Box as="span" mr={3}>
              🇬🇧
            </Box>
            {t('english')}
          </MenuItemOption>
          <MenuItemOption
            value={Locale.Uk}
            onClick={() => switchToLocale(Locale.Uk)}
          >
            <Box as="span" mr={3}>
              🇺🇦
            </Box>
            {t('ukrainian')}
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
