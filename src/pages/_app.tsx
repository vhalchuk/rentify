import { ChakraProvider } from '@chakra-ui/react'
import '@total-typescript/ts-reset'
import type { NextPage } from 'next'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation } from 'next-i18next'
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
  if (Component.Layout) {
    return (
      <SessionProvider session={session}>
        <ChakraProvider>
          <Component.Layout>
            <Component {...pageProps} />
          </Component.Layout>
        </ChakraProvider>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}

export default api.withTRPC(appWithTranslation(MyApp))
