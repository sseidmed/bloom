"use client"
import { usePathname } from "next/navigation"
import Editor from './Editor'

const PromptWrapper = ({ userLanguages, entry }) => {
  // console.log("what is entry", entry.id)
  const pathname = usePathname()
  const isNewPrompt = pathname === '/seedlings/new-seed'

  return (
    <Editor userLanguages={userLanguages} entry={entry} isNewPrompt={isNewPrompt} />
  )
}

export default PromptWrapper
