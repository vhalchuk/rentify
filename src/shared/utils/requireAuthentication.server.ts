import { type GetServerSidePropsContext } from 'next'
import { type Session } from 'next-auth'
import { type GetServerSidePropsResult } from 'next/types'
import { getServerAuthSession } from '~/shared/api/auth.server'

export const requireAuthentication = async (
  context: GetServerSidePropsContext,
  cb?: (
    session: Session
  ) => Promise<GetServerSidePropsResult<Record<string, unknown>>>
) => {
  const session = await getServerAuthSession(context)

  if (!session) {
    return {
      redirect: {
        destination: `/api/auth/signin`,
        permanent: false,
      },
    }
  }

  if (cb) {
    return cb(session)
  }

  return { props: {} }
}
