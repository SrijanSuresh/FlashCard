import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    candidateCount: 1,
    stopSequences: ["x"],
    maxOutputTokens: 20,
    temperature: 1.0,
  },
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
    }

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
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: 'model',
          parts: [
            {
              text: systemPrompt,
            }
          ],
        },
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            }
          ],
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      },
    });

    const rawText = await result.response.text();

    // Log the raw response to see what is returned
    console.log('Raw API Response:', rawText);

    // Attempt to extract JSON from the raw response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in the response:', rawText);
      return NextResponse.json({ error: 'No valid JSON found in the response' }, { status: 500 });
    }

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json({ error: 'Failed to parse JSON response' }, { status: 500 });
    }

    // Extract and return the flashcards array
    if (jsonResponse.flashcards) {
      return NextResponse.json({ flashcards: jsonResponse.flashcards }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Flashcards not found in response' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error generating flashcards' }, { status: 500 });
  }
}
