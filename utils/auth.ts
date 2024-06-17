// import type { User } from '@clerk/nextjs/api'
import { prisma } from './db'
import { auth } from '@clerk/nextjs/server'

export const getUserFromClerkID = async (select = { id: true }) => {
  const { userId } = auth()
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
    select,
  })
  return user
}