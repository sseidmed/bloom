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
  const user = await getUserFromClerkID()

  const entry = await prisma.prompt.update({
    where: {
      id: params.id,
    },
    data: updates,
  })

  const analysis = await analyzeEntry(entry.answer)
  console.log("analysis from route", analysis)
  console.log("what is params", params.id)

  const savedAnalysis = await prisma.promptAnalysis.upsert({
    where: {
      promptId: params.id,
    },
    update: { ...analysis },
    create: {
      promptId: params.id,
      userId: user.id,
      ...analysis,
    },
  })

  update(['/seedlings'])
  return NextResponse.json({ data: { ...entry, analysis: savedAnalysis } })
}