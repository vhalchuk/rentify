import { Container, Flex } from '@chakra-ui/react'
import { useScroll } from 'framer-motion'
import { type FC, type ReactNode, useEffect, useRef, useState } from 'react'

export const Header: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {}

  const { scrollY } = useScroll()
  useEffect(() => {
    return scrollY.on('change', () => setY(scrollY.get()))
  }, [scrollY])

  return (
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
        {children}
      </Container>
    </Flex>
  )
}
