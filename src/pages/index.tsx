import { type NextPageWithLayout } from '~/pages/_app'
import { PageLayout } from '~/widgets/pageLayout'

const Page: NextPageWithLayout = () => {
  return <p>Home page</p>
}

Page.Layout = PageLayout

export default Page
