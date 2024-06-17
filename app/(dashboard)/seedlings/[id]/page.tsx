
import Editor from '@/components/Editor'
import PromptWrapper from '@/components/PromptWrapper'
import { getUserFromClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getEntry = async (id) => {
  const entry = await prisma.prompt.findUnique({
    where: {
      id: id
    },
    include: {
      globalPrompt: true,
      userLanguage: {
        include: {
          language: true,
        }
      }
    }
  })

  return entry
}

const getUserLanguages = async() => {
  const user = await getUserFromClerkID()
  const userLanguages = await prisma.userLanguage.findMany({
    where: {
      userId: user.id
    },
    include: {
      language: {
        include: {
          globalPrompts: true
        }
      }
    }
  })

  return userLanguages
}

const JournalEditorPage = async ({ params }) => {
  const entry = await getEntry(params.id)
  const userLanguages = await getUserLanguages()

  return (
    <div className="w-full h-full">
      <PromptWrapper userLanguages={userLanguages} entry={entry} />
    </div>
  )
}

export default JournalEditorPage