import Link from 'next/link'
import { type FC, type ReactNode } from 'react'

export type PageLayoutProps = {
  children: ReactNode
}

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <div>
      <header>Header</header>
      <nav>
        <ul>
          <li>
            <Link href="/properties">Properties</Link>
          </li>
        </ul>
      </nav>
      {children}
      <aside>aside</aside>
    </div>
  )
}
