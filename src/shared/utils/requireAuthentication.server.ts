import { type GetServerSidePropsContext } from 'next'
import { type Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { type GetServerSidePropsResult } from 'next/types'

export const requireAuthentication = async (
  context: GetServerSidePropsContext,
  cb?: (
    session: Session
  ) => Promise<GetServerSidePropsResult<Record<string, unknown>>>
) => {
  const session = await getSession(context)

  if (!session) {
    const requestedUrl = context.req.url
    const redirectURL = encodeURIComponent(requestedUrl || '')

    return {
      redirect: {
        destination: `/authenticate?redirectURL=${redirectURL}`,
        permanent: false,
      },
    }
  }

  if (cb) {
    return cb(session)
  }

  return { props: {} }
}
