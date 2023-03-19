import { type GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { type NextPageWithLayout } from '~/pages/_app'
import { PageLayout } from '~/shared/pageLayout'
import { type WithLocale } from '~/shared/types/locale'
import { requireAuthentication } from '~/shared/utils/requireAuthentication.server'

const Page: NextPageWithLayout = () => {
  return (
    <div>
      <Link href="/">Back</Link>
      <p>Property list page</p>
    </div>
  )
}

export function getServerSideProps(
  context: WithLocale<GetServerSidePropsContext>
) {
  return requireAuthentication(context, async () => {
    return {
      props: {
        ...(await serverSideTranslations(context.locale, ['common'])),
      },
    }
  })
}

Page.Layout = PageLayout

export default Page
