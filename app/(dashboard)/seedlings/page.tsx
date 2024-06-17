import EntryCard from '@/components/EntryCard'
import NewEntry from '@/components/NewEntry'
// import Question from '@/components/Question'
// import { qa } from '@/util/ai'
import { getUserFromClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import Link from 'next/link'

const getEntries = async () => {
  const user = await getUserFromClerkID()
  const data = await prisma.prompt.findMany({
    where: {
      userLanguage: {
        userId: user.id,
      },
    },
    include: {
      globalPrompt: true,
      userLanguage: {
        include: {
          language: true,
        },
      },
    },
  })

  return data
}

const SeedlingsPage = async () => {
  const data = await getEntries()
  return (
    <div className="px-6 py-8 bg-zinc-100/50 h-full">
      <h1 className="text-4xl mb-12">My seedlings</h1>
      {/* <div className="my-8">
        <Question />
      </div> */}

      <div className="grid grid-cols-4 gap-3 mb-8">
        <NewEntry />
        {data.map((prompt) => (
          <div key={prompt.id}>
            <Link href={`/seedlings/${prompt.id}`}>
              <EntryCard prompt={prompt} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SeedlingsPage