"use client"
import { createEntry, updateEntry, getEntry, deleteEntry } from "@/utils/api"
import { useEffect, useState } from "react"
import { useAutosave } from "react-autosave"
import Spinner from "./Spinner"
import { useRouter } from "next/navigation"
import { analyzeEntry } from "@/utils/ai"

const Editor = ({ userLanguages, entry: initialEntry, isNewPrompt }) => {
  const [entry, setEntry] = useState(initialEntry)
  const [selectedLanguage, setSelectedLanguage] = useState(
    initialEntry
      ? { id: initialEntry.userLanguage.id, name: initialEntry.userLanguage.language.name }
      : { id: "", name: "" }
  )
  const [globalPrompts, setGlobalPrompts] = useState([])
  const [selectedPrompt, setSelectedPrompt] = useState(
    initialEntry ? initialEntry.globalPrompt : null
  )
  const [promptAnswer, setPromptAnswer] = useState(initialEntry ? initialEntry.answer : "")

  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    // await deleteEntry(entry.id)
    router.push("/seedlings")
  }

  const handleClickLanguageSelect = (event) => {
    const selectedLanguageData = JSON.parse(event.target.value)
    setSelectedLanguage({
      id: selectedLanguageData.id,
      name: selectedLanguageData.name,
    })

    const selectedLang = userLanguages.find(
      (userLang) => userLang.language.name === selectedLanguageData.name
    )
    setGlobalPrompts(selectedLang ? selectedLang.language.globalPrompts : [])
  }

  const handleClickSelectPrompt = (globalPrompt) => {
    return async () => {
      setSelectedPrompt(globalPrompt)
      const selectedLang = userLanguages.find(
        (lang) => lang.id === selectedLanguage.id
      )

      // create a new prompt with a default answer
      const { data } = await createEntry(globalPrompt.id, selectedLang.id)
      setEntry(data)
    }
  }

  const handleClickTextChange = (e) => {
    setPromptAnswer(e.target.value)
  }

  useAutosave({
    data: promptAnswer,
    onSave: async (_promptAnswer) => {
      // only run this on the existing prompt or after the prompt is created

      if (entry) {
        if (_promptAnswer === entry?.answer) return
        setIsSaving(true)

        try {
          const updatedEntry = await updateEntry(entry.id || entry.data.id, { answer: _promptAnswer })
          setEntry(updatedEntry)
        } catch (error) {
          console.error("Error saving entry:", error)
        } finally {
          setIsSaving(false)
        }
      }
    },
  })


  return (
    <div className="w-full h-full grid grid-cols-3 gap-0 relative">
      <div className="absolute left-0 top-0 p-2">
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
        )}
      </div>

      <div className="col-span-2">
        {!entry && (
          <div className="max-w-sm mt-8 ml-2">
            <select
              id="languages"
              value={selectedLanguage}
              onChange={handleClickLanguageSelect}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Choose a patch</option>
              {userLanguages.map((l) => (
                <option
                  key={l.id}
                  value={JSON.stringify({ id: l.id, name: l.language.name })}
                >
                  {l.language.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedPrompt && <div className="mt-8 ml-2 text-xl font-semibold">{selectedPrompt.content}</div>}

        {selectedLanguage && (
          <div className="grid grid-cols-4 gap-4">
            {globalPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {prompt.content}
                </p>
                <button
                  onClick={handleClickSelectPrompt(prompt)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Plant
                </button>
              </div>
            ))}
          </div>
        )}

        {(selectedPrompt?.content || promptAnswer) &&(
            <div>
              <textarea
                value={promptAnswer}
                placeholder="Let's grow your garden! 🌱🌱🌱🌱🌱"
                onChange={handleClickTextChange}
                className="w-full h-96 text-xl p-8 mt-4"
              ></textarea>
            </div>
        )}
      </div>

      <div className="border-l border-black/5">
        <div
          className="h-[100px] bg-[#B3EBA6] text-white p-8"
        >
          <h2 className="text-2xl text-black">Analysis</h2>
        </div>
        <div>
          <ul role="list" className="divide-y divide-gray-200">
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold w-1/3">Subject</div>
              <div className="text-xl">{initialEntry.analysis.subject}</div>
            </li>

            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Mood</div>
              <div className="text-xl">{initialEntry.analysis.mood}</div>
            </li>

            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Negative</div>
              <div className="text-xl">
                {initialEntry.analysis.negative ? 'True' : 'False'}
              </div>
            </li>
            <li className="py-4 px-8">
              <div className="text-xl font-semibold">Summary</div>
              <div className="text-xl">{initialEntry.analysis?.summary}</div>
            </li>
            <li className="py-4 px-8 flex justify-between">
              <div className="text-xl font-semibold">Color</div>
              <div className="text-xl min-w-14"  style={{ backgroundColor: initialEntry.analysis.color }} />
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Reading Level</div>
              <div className="text-xl">{initialEntry.analysis.readingLevel}</div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Keywords</div>
              <div className="text-xl">{initialEntry.analysis.keywords}</div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Category</div>
              <div className="text-xl">{initialEntry.analysis.category}</div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Sentiment Label</div>
              <div className="text-xl">{initialEntry.analysis.sentimentLabel}</div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Sentiment Score</div>
              <div className="text-xl">{initialEntry.analysis.sentimentScore}</div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <button
                onClick={handleDelete}
                type="button"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Editor
