import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal'
import { Stack } from '@chakra-ui/react'
import { type FC } from 'react'
import { HeaderDrawerUserMenu } from './header-drawer-user-menu'
import { Navigation } from './navigation'

type NavigationDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export const HeaderDrawer: FC<NavigationDrawerProps> = ({
  onClose,
  isOpen,
}) => {
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px" p={0}>
          <HeaderDrawerUserMenu />
        </DrawerHeader>
        <DrawerBody>
          <Stack role="group" mt="4" as="nav">
            <Navigation />
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
