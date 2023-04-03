import { Box, Button, Flex, Heading, HStack } from '@chakra-ui/react'
import { type GetServerSidePropsContext } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import NextLink from 'next/link'
import { BsGoogle } from 'react-icons/all'
import { type NextPageWithLayout } from '~/pages/_app'
import { Logo } from '~/shared/icons/logo'
import { Header } from '~/shared/pageLayout/ui/header'
import { UserMenuButton } from '~/shared/pageLayout/ui/user-menu-button'
import { type WithLocale } from '~/shared/types/locale'

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const session = useSession()
  const authenticated = session.status === 'authenticated'

  return (
    <Header>
      <HStack gap={2}>
        <Logo />
        <Heading as="h1" fontSize="2rem" color="green.500">
          Rentify
        </Heading>
      </HStack>
      <Box ml="auto">
        {authenticated ? (
          <Flex gap={3}>
            <Button as={NextLink} href="/dashboard" variant="ghost">
              {t('dashboard')}
            </Button>
            <UserMenuButton />
          </Flex>
        ) : (
          <Button
            leftIcon={<BsGoogle />}
            onClick={() => void signIn('google', { callbackUrl: '/dashboard' })}
            variant="outline"
          >
            {t('googleSignIn')}
          </Button>
        )}
      </Box>
    </Header>
  )
}

export const getServerSideProps = async ({
  locale,
}: WithLocale<GetServerSidePropsContext>) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default Page
