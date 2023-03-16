import { Box, Flex, Heading } from '@chakra-ui/react'
import { Funnel, List, MagnifyingGlass } from '@phosphor-icons/react'
import Link from 'next/link'
import { type FC, type ReactNode } from 'react'

export type PageLayoutProps = {
  children: ReactNode
}

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <Box mt="80px">
      <Flex
        as="header"
        position="fixed"
        top="0"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        p={4}
        zIndex="10"
        borderBottom="1px"
        borderBottomColor="gray.200"
        backgroundColor="white"
        gap="6"
      >
        <Flex alignItems="center" gap="6">
          <List size={24} weight="bold" />
          <Heading as="h1" size="lg" color="green.500">
            Rentify
          </Heading>
        </Flex>
        <Flex alignItems="center" gap="6">
          <MagnifyingGlass size={24} weight="bold" />
          <Funnel size={24} weight="bold" />
        </Flex>
      </Flex>
      <nav>
        <ul>
          <li>
            <Link href="/properties">Properties</Link>
          </li>
        </ul>
      </nav>
      {children}
      <aside>aside</aside>
    </Box>
  )
}
