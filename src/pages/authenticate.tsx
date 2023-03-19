import { Box, Button, Center } from '@chakra-ui/react'
import { type GetServerSidePropsContext, type NextPage } from 'next'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { BsGoogle } from 'react-icons/all'

const Page: NextPage = () => {
  const router = useRouter()

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
          colorScheme="blue"
          onClick={handleSignIn}
        >
          Continue with Google
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

  console.log('context', context)

  return {
    props: {},
  }
}

export default Page
