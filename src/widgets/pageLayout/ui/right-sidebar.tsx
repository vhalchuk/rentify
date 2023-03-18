import { Box } from '@chakra-ui/react'
import { type FC } from 'react'

export const RightSidebar: FC = () => {
  return (
    <Box
      as="aside"
      width="240px"
      pos="sticky"
      overscrollBehavior="contain"
      top="6.5rem"
      w="240px"
      h="calc(100vh - 8.125rem)"
      pb="6"
      pt="4"
      overflowY="auto"
      flexShrink={0}
      display={{ base: 'none', xl: 'block' }}
    >
      <div id="right-sidebar-portal-container" />
      Whatever
    </Box>
  )
}
