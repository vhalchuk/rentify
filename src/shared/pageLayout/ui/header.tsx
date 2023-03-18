import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  useDisclosure,
} from '@chakra-ui/react'
import { useScroll } from 'framer-motion'
import { type FC, useEffect, useRef, useState } from 'react'
import { Logo } from '~/shared/icons/logo'
import { HeaderDrawer } from './header-drawer'
import { MobileNavButton } from './mobile-nav-button'

export const Header: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {}

  const { scrollY } = useScroll()
  useEffect(() => {
    return scrollY.on('change', () => setY(scrollY.get()))
  }, [scrollY])

  return (
    <>
      <HeaderDrawer isOpen={isOpen} onClose={onClose} />
      <Flex
        ref={ref}
        as="header"
        position="sticky"
        top="0"
        left="0"
        right="0"
        zIndex="3"
        shadow={y > height ? 'sm' : undefined}
        backgroundColor="white"
        width="full"
        transition="box-shadow 0.2s, background-color 0.2s"
        _dark={{ bg: 'gray.800' }}
      >
        <Container
          as={Flex}
          alignItems="center"
          gap="6"
          px={4}
          height="4.5rem"
          maxW="8xl"
        >
          <Flex alignItems="center" gap={4}>
            <MobileNavButton onClick={onOpen} />
            <HStack display={{ base: 'none', md: 'flex' }} gap={2}>
              <Logo />
              <Heading as="h1" fontSize="2rem" color="green.500">
                Rentify
              </Heading>
            </HStack>
          </Flex>
          <Box flexGrow={1}>
            <Flex alignItems="center" gap="6">
              <div id="header-portal-container" />
            </Flex>
          </Box>
        </Container>
      </Flex>
    </>
  )
}
