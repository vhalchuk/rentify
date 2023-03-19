import { VStack } from '@chakra-ui/react'
import { type GetServerSidePropsContext } from 'next'
import { useSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { type NextPageWithLayout } from '~/pages/_app'
import { type WithLocale } from '~/shared/types/locale'

const Page: NextPageWithLayout = () => {
  const session = useSession()

  if (session.status === 'authenticated') {
    return (
      <VStack>
        <Link href="/dashboard">Dashboard</Link>
      </VStack>
    )
  }

  return <Link href="/authenticate">Authenticate</Link>
}

export const getServerSideProps = async ({
  locale,
}: WithLocale<GetServerSidePropsContext>) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default Page
