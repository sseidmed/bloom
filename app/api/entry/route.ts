import { update } from '@/utils/actions'
import { getUserFromClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  const data = await request.json()
  const user = await getUserFromClerkID()

  const entry = await prisma.prompt.create({
    data: {
      answer: "Default answer to be replaced",
      globalPromptId: data.globalPromptId,
      userLanguageId: data.selectedLanguageId,
    },
  })

  // const userLanguage = await prisma.userLanguage.findUnique({
  //   where: {
  //     userId: user.id,
  //     languageId: 
  //   }
  // })
  // const prompt = await prisma.prompt.create({
  //   data: {
  //     answer: answer,
  //     globalPrompt: globalPromptId,
  //     userLanguageId: userLanguageId,
  //   }
  // })



    // data: {
    //   content: data.content,
    //   user: {
    //     connect: {
    //       id: user.id,
    //     },
    //   },
    //   analysis: {
    //     create: {
    //       mood: 'Neutral',
    //       subject: 'None',
    //       negative: false,
    //       summary: 'None',
    //       sentimentScore: 0,
    //       color: '#0101fe',
    //       userId: user.id,
    //     },
    //   },
    // },

  update(['/seedlings'])

  return NextResponse.json({ data: entry })
}