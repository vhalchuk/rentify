import { type GetServerSidePropsContext } from 'next'
import { type Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export const requireAuthentication = async (
  context: GetServerSidePropsContext,
  cb?: (context: GetServerSidePropsContext, session: Session) => void
) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/authenticate',
        permanent: false,
      },
    }
  }

  if (cb) {
    return cb(context, session)
  }

  return { props: {} }
}
