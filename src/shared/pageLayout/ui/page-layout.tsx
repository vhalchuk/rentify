import {
  Box,
  Flex,
  Heading,
  HStack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { type FC, type ReactNode } from 'react'
import { Logo } from '~/shared/icons/logo'
import { HeaderDrawer } from '~/shared/pageLayout/ui/header-drawer'
import { MobileNavButton } from '~/shared/pageLayout/ui/mobile-nav-button'
import { UserMenuButton } from '~/shared/pageLayout/ui/user-menu-button'
import { Header } from './header'
import { Navigation } from './navigation'
import { RightSidebar } from './right-sidebar'

export type PageLayoutProps = {
  children: ReactNode
}

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Header>
        <HeaderDrawer isOpen={isOpen} onClose={onClose} />
        <Flex alignItems="center" gap={4}>
          <MobileNavButton onClick={onOpen} />
          <HStack display={{ base: 'none', md: 'flex' }} gap={2}>
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
      <Box as="main" w="full" maxW="8xl" mx="auto">
        <Box display={{ md: 'flex' }}>
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
            display={{ base: 'none', md: 'block' }}
          >
            <VStack>
              <Navigation />
            </VStack>
          </Box>
          <Box flexGrow={1}>
            <Flex>
              <Box
                minW="0"
                flex="auto"
                px={{ base: '4', sm: '6', xl: '8' }}
                pt="10"
                height="200vh"
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
