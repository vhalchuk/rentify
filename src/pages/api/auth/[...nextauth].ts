import NextAuth from 'next-auth'
import { authOptions } from '~/shared/api/index.server'

export default NextAuth(authOptions)
