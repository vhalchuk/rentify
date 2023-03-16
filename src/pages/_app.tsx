import type { NextPage } from 'next'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import type { FC, ReactNode } from 'react'
import { api } from '~/shared/api'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  Layout?: FC<{ children: ReactNode }>
}

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available

  if (Component.Layout) {
    return (
      <SessionProvider session={session}>
        <Component.Layout>
          <Component {...pageProps} />
        </Component.Layout>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
