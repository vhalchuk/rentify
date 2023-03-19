import { IconButton, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { type FC } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import { HeaderDrawer } from './header-drawer'

export const MobileNavButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <HeaderDrawer isOpen={isOpen} onClose={onClose} />
      <IconButton
        display={{ base: 'flex', lg: 'none' }}
        aria-label="Open menu"
        fontSize="20px"
        color={useColorModeValue('gray.800', 'inherit')}
        variant="ghost"
        icon={<AiOutlineMenu />}
        onClick={onOpen}
      />
    </>
  )
}
