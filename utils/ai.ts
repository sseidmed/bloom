import { OpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'

import { loadQARefineChain } from 'langchain/chains'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from '@langchain/openai'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { OutputFixingParser } from "langchain/output_parsers"

import { Document } from "@langchain/core/documents"
import { z } from "zod"

const analysisSchema = z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the entry.'),
    subject: z.string().describe('the subject of the entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
    summary: z.string().describe('quick summary of the entire entry. The summary should be in the original language. For example, an entry in Turkish should have a Turkish summary'),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
      ),
    sentimentLabel: z.string().describe('sentiment label of the entry like negative or positive. It should be in the original language'),
    emotion: z.string().describe('emotion like joy, anger, peace, etc of the given entry. It should be in the original language'),
    emotionScore: z.number().describe('emotion score also based from -10 to 10, -10 being the worst of emotions like hatred or anger'),
    wordCount: z.number().describe('count the number of words in the entry'),
    sentenceCount: z.number().describe('count the number of sentences'),
    readingLevel: z.string().describe('give reading level based on the reading test that pertains to each language. For example, English will use Flesch-Kincaid test. It should be in the original language.'),
    category: z.string().describe('Give one word category that this entry falls under. It should be in the original language.'),
  })

const parsedAnalysis = StructuredOutputParser.fromZodSchema(analysisSchema)

const getPrompt = async (content) => {
  const format_instructions = parsedAnalysis.getFormatInstructions()
  const prompt = new PromptTemplate({
    template:
      'Analyze the following prompt entry that is the reply to a given prompt in a target foreign language. Prompt is a question or a statement that the user will give an answer to in a few sentences in their target language. Follow the intructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })


  const input = await prompt.format({
    entry: content,
  })
  return input
}

export const analyzeEntry = async (entry) => {
  const input = await getPrompt(entry)
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const output = await model.invoke(input)

  try {
    return parsedAnalysis.parse(output)
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo', apiKey: process.env.OPENAI_API_KEY }),
      parsedAnalysis
    )
    const fix = await fixParser.parse(output)
    return fix
  }
}

// export const qa = async (question, entries) => {
//   const docs = entries.map(
//     (entry) =>
//       new Document({
//         pageContent: entry.content,
//         metadata: { source: entry.id, date: entry.createdAt },
//       })
//   )
//   const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
//   const chain = loadQARefineChain(model)
//   const embeddings = new OpenAIEmbeddings()
//   const store = await MemoryVectorStore.fromDocuments(docs, embeddings)
//   const relevantDocs = await store.similaritySearch(question)
//   const res = await chain.invoke({
//     input_documents: relevantDocs,
//     question,
//   })

//   return res.output_text
// }