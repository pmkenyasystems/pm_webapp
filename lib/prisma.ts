import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
}

// Use cached client only if it has all expected models (e.g. countyOfficial after schema change)
const cached = globalForPrisma.prisma
const hasCountyOfficial = cached && 'countyOfficial' in cached && typeof (cached as PrismaClient).countyOfficial?.findMany === 'function'
export const prisma = cached && hasCountyOfficial ? cached : (() => {
  const client = createPrismaClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }
  return client
})()

