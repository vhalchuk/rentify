import { type GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { type NextPageWithLayout } from '~/pages/_app'
import { PageLayout } from '~/shared/pageLayout'
import { requireAuthentication } from '~/shared/utils/requireAuthentication.server'

const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>Property {id}</p>
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return requireAuthentication(context)
}

Page.Layout = PageLayout

export default Page
