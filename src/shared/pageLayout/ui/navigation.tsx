import { chakra, type PropsOf, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { type FC, forwardRef, type Ref } from 'react'

const StyledLink = forwardRef(function StyledLink(
  props: PropsOf<typeof chakra.a> & {
    isActive?: boolean
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>
) {
  const { isActive, ...rest } = props

  return (
    <chakra.span
      aria-current={isActive ? 'page' : undefined}
      display="inline-block"
      width="100%"
      px="4"
      py="1"
      rounded="md"
      ref={ref}
      fontSize="1rem"
      fontWeight="500"
      color="fg"
      transition="all 0.2s"
      _activeLink={{
        bg: useColorModeValue('green.50', 'rgba(48, 140, 122, 0.3)'),
        color: 'green.700',
        fontWeight: '600',
      }}
      {...rest}
    />
  )
})

const routes = [
  {
    href: '/dashboard',
    translationKey: 'dashboard',
  },
  {
    href: '/calendar',
    translationKey: 'calendar',
  },
  {
    href: '/properties',
    translationKey: 'properties',
  },
  {
    href: '/income',
    translationKey: 'income',
  },
  {
    href: '/expenses',
    translationKey: 'expenses',
  },
  {
    href: '/managers',
    translationKey: 'managers',
  },
  {
    href: '/owners',
    translationKey: 'owners',
  },
]

export const Navigation: FC = () => {
  const router = useRouter()
  const currentPath = router.asPath
  const { t } = useTranslation()

  return (
    <>
      {routes.map(({ href, translationKey }) => (
        <NextLink href={href} passHref key={href} style={{ width: '100%' }}>
          <StyledLink isActive={currentPath.startsWith(href)}>
            {t(translationKey)}
          </StyledLink>
        </NextLink>
      ))}
    </>
  )
}
