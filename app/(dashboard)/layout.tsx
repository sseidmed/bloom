import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const links = [
  { name: '🌿 Seedlings', href: '/seedlings' },
  { name: '🌰 Seed Library', href: '/library' },
  { name: '📝 Word Lists', href: '/lists'},
  { name: '📊 Info', href: '/info' },
]

const DashboardLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen relative outline-dotted bg-svg bg-[#D4F8BF]">
      <aside className="absolute left-0 top-0 h-full w-[200px] border-r border-black/10">
        <div className="px-4 my-4">
          <span className="text-3xl">BLOOM</span>
        </div>
        <div>
          <ul className="px-4">
            {links.map((link) => (
              <li key={link.name} className="text-xl my-4">
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="ml-[200px] h-full w-[calc(100vw-200px)]">
        <header className="h-[60px] border-b border-black/10">
          <nav className="px-4 h-full">
            <div className="flex items-center justify-end h-full">
              <UserButton afterSignOutUrl="/" />
            </div>
          </nav>
        </header>
        <div className="h-[calc(100vh-60px)]">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout