import { Box, Flex, VStack } from '@chakra-ui/react'
import { type FC, type ReactNode } from 'react'
import { Header } from '~/widgets/pageLayout/ui/Header'
import { Navigation } from '~/widgets/pageLayout/ui/Navigation'
import { RightSidebar } from '~/widgets/pageLayout/ui/RightSidebar'

export type PageLayoutProps = {
  children: ReactNode
}

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <Box>
      <Header />
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
    </Box>
  )
}
