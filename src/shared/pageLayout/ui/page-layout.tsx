import { Box, Flex, Heading, HStack, VStack } from '@chakra-ui/react'
import { type FC, type ReactNode } from 'react'
import { Logo } from '~/shared/icons/logo'
import { Header } from './header'
import { MobileNavButton } from './mobile-nav-button'
import { Navigation } from './navigation'
import { RightSidebar } from './right-sidebar'
import { UserMenuButton } from './user-menu-button'

export type PageLayoutProps = {
  children: ReactNode
}

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <>
      <Header>
        <Flex alignItems="center" gap={4}>
          <MobileNavButton />
          <HStack display={{ base: 'none', lg: 'flex' }} gap={2}>
            <Logo />
            <Heading as="h1" fontSize="2rem" color="green.500">
              Rentify
            </Heading>
          </HStack>
        </Flex>
        <Flex alignItems="center" flexGrow={1}>
          <div id="header-portal-container" />
        </Flex>
        <UserMenuButton />
      </Header>
      <Box w="full" maxW="8xl" mx="auto">
        <Box display={{ lg: 'flex' }}>
          <Box
            aria-label="Main Navigation"
            as="nav"
            pos="sticky"
            overscrollBehavior="contain"
            top="6.5rem"
            w="240px"
            h="calc(100vh - 8.125rem)"
            pb="6"
            pt="4"
            overflowY="auto"
            flexShrink={0}
            display={{ base: 'none', lg: 'block' }}
          >
            <VStack>
              <Navigation />
            </VStack>
          </Box>
          <Box flexGrow={1}>
            <Flex>
              <Box
                as="main"
                minW="0"
                flex="auto"
                px={{ base: '4', sm: '6', xl: '8' }}
                pt="10"
              >
                {children}
              </Box>
              <RightSidebar />
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  )
}
