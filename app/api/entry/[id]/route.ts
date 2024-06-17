import { update } from '@/utils/actions'
import { analyzeEntry } from '@/utils/ai'
import { getUserFromClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export const DELETE = async (request: Request, { params }) => {

  await prisma.prompt.delete({
    where: {
      id: params.id,
    },
  })

  update(['/seedlings'])

  return NextResponse.json({ data: { id: params.id } })
}

export const PATCH = async (request: Request, { params }) => {
  const { updates } = await request.json()

  const entry = await prisma.prompt.update({
    where: {
      id: params.id,
    },
    data: updates,
  })

  // const analysis = await analyzeEntry(entry)
  // const savedAnalysis = await prisma.entryAnalysis.upsert({
  //   where: {
  //     entryId: entry.id,
  //   },
  //   update: { ...analysis },
  //   create: {
  //     entryId: entry.id,
  //     userId: user.id,
  //     ...analysis,
  //   },
  // })

  update(['/seedlings'])
  return NextResponse.json({ data: { ...entry } })

  // return NextResponse.json({ data: { ...entry, analysis: savedAnalysis } })
}