import { Button, VStack } from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { HiOutlineLogout } from 'react-icons/all'
import { type NextPageWithLayout } from '~/pages/_app'
import { type Locale } from '~/shared/types/locale'

const Page: NextPageWithLayout = () => {
  const session = useSession()

  if (session.status === 'authenticated') {
    return (
      <VStack>
        <Link href="/dashboard">Dashboard</Link>
        <Button
          leftIcon={<HiOutlineLogout />}
          colorScheme="blue"
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      </VStack>
    )
  }

  return <Link href="/authenticate">Authenticate</Link>
}

export const getServerSideProps = async ({ locale }: { locale: Locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default Page
