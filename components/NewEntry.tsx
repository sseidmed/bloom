'use client'

import { createEntry } from '@/utils/api'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'

const NewEntry = () => {
  const router = useRouter()

  const handleClickCreateEntry = async () => {
    // const { data } = await createEntry()
    router.push(`/seedlings/new-seed`)
  }

  return (
    <div
      className="mt-6 cursor-pointer overflow-hidden text-gray-700 bg-white shadow-md bg-clip-border rounded-xl outline h-72"
      onClick={handleClickCreateEntry}
    >
      <div className="px-4 py-5 sm:p-6">
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          New Entry +
        </button>
      </div>
    </div>
  )
}

export default NewEntry