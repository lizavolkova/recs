import { NextResponse } from 'next/server'
import getGeminiData from "@/app/api/ai/gemini";
import { getAIData } from "@/app/api/ai/openai";
export async function POST(req) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'method not allowed' }, { status: 405 })
    }

    const ingredients = await req.json();
  //  const aiData = await getGeminiData(ingredients)
 //   console.log(JSON.parse(JSON.stringify(aiData)))

  //  const aiData = await getOAIData(ingredients)

    const {dishType, healthLabels} = await getAIData(ingredients)

    return NextResponse.json({dishType, healthLabels}, { status: 200 })
}