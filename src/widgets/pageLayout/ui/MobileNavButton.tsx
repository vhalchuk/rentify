import { IconButton, useColorModeValue } from '@chakra-ui/react'
import { type FC } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'

type MobileNavButtonProps = {
  onClick?: () => void
}

export const MobileNavButton: FC<MobileNavButtonProps> = ({ onClick }) => {
  return (
    <IconButton
      display={{ base: 'flex', md: 'none' }}
      aria-label="Open menu"
      fontSize="20px"
      color={useColorModeValue('gray.800', 'inherit')}
      variant="ghost"
      icon={<AiOutlineMenu />}
      onClick={onClick}
    />
  )
}
