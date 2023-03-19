import { type GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type NextPageWithLayout } from '~/pages/_app'
import { PropertiesList } from '~/widgets/properties-list'
import { PageLayout } from '~/shared/pageLayout'
import { type WithLocale } from '~/shared/types/locale'
import { requireAuthentication } from '~/shared/utils/requireAuthentication.server'

const Page: NextPageWithLayout = () => {
  return <PropertiesList />
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
