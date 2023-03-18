import { type GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { type NextPageWithLayout } from '~/pages/_app'
import { PageLayout } from '~/shared/pageLayout'
import { requireAuthentication } from '~/shared/utils/requireAuthentication.server'

const Page: NextPageWithLayout = () => {
  return (
    <div>
      <Link href="/">Back</Link>
      <p>Dashboard page</p>
    </div>
  )
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return requireAuthentication(context)
}

Page.Layout = PageLayout

export default Page
