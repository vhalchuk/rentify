import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal'
import { HStack, IconButton, Stack, useColorModeValue } from '@chakra-ui/react'
import { type FC } from 'react'
import { CgProfile, VscGlobe } from 'react-icons/all'
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
        <DrawerHeader borderBottomWidth="1px">
          <HStack justifyContent="space-between">
            <IconButton
              aria-label="Expand user menu"
              fontSize="24px"
              color={useColorModeValue('gray.800', 'inherit')}
              variant="ghost"
              icon={<CgProfile />}
            />
            <IconButton
              aria-label="Expand languages menu"
              fontSize="24px"
              color={useColorModeValue('gray.800', 'inherit')}
              variant="ghost"
              icon={<VscGlobe />}
            />
          </HStack>
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
