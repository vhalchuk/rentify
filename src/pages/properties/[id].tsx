import { useRouter } from 'next/router'
import { type NextPageWithLayout } from '~/pages/_app'
import { PageLayout } from '~/shared/pageLayout'

const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>Property {id}</p>
}

Page.Layout = PageLayout

export default Page
