import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()
  let href = userId ? '/seedlings' : '/new-user'

  return (
    <div className="w-screen h-screen bg-[#D4F8BF] flex justify-center text-black">
    <div className="w-full max-w-[700px] mx-auto mt-40">
      <h1 className="text-6xl mb-4">🌿 BLOOM 🌸</h1>
      <p className="text-2xl text-black/60 mb-4">
      Grow Your Language Skills, One Word at a Time.
      </p>
      <div>
        <Link href={href}>
          <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl text-white">
            Get started
          </button>
        </Link>
      </div>
    </div>
  </div>
  )
}