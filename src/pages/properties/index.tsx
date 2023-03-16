import Link from 'next/link'
import { type NextPageWithLayout } from '~/pages/_app'
import { PageLayout } from '~/widgets/pageLayout'

const Page: NextPageWithLayout = () => {
  return (
    <div>
      <Link href="/">Back</Link>
      <p>Property list page</p>
    </div>
  )
}

Page.Layout = PageLayout

export default Page
