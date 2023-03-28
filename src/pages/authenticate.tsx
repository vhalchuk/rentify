import { Box, Button, Center } from '@chakra-ui/react'
import { type GetServerSidePropsContext, type NextPage } from 'next'
import { getSession, signIn } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { BsGoogle } from 'react-icons/all'

const Page: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const handleSignIn = () => {
    const callbackUrl =
      typeof router.query.redirectURL === 'string'
        ? router.query.redirectURL
        : '/dashboard'

    void signIn('google', {
      callbackUrl,
    })
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Center>
        <Button
          leftIcon={<BsGoogle />}
          onClick={handleSignIn}
          variant="outline"
        >
          {t('googleSignIn')}
        </Button>
      </Center>
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default Page
