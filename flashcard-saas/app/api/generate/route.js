import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from 'google/gemini'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`
export async function POST(req) {
    const gemini = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
    const data = await req.text()
  
    const completion = await gemini.generateText({
      prompt: systemPrompt,
      userInput: data,
      model: 'gemini-1',
      responseFormat: 'json',
    })
  
    // Parse the JSON response from the Gemini API
    const flashcards = JSON.parse(completion.data)
  
    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards)
  }
  