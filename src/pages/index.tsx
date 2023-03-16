import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { type NextPageWithLayout } from '~/pages/_app'
import { PageLayout } from '~/widgets/pageLayout'
import { type Locale } from '~/shared/types/locale'

export const getServerSideProps = async ({ locale }: { locale: Locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation('common')

  return <p>{t('hello-frontend')}</p>
}

Page.Layout = PageLayout

export default Page
