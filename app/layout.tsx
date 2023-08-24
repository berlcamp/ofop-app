import 'server-only'
import './globals.css'
import { Providers } from '@/GlobalRedux/provider'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OFOP',
  description: 'OFOP by BTC'
}

// do not cache this layout
export const revalidate = 0

export default async function RootLayout ({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='bg-white'>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
