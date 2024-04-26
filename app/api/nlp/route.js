import { NextResponse } from 'next/server'
import nlpIngredients from "@/app/api/nlp/nlp";
import getOAIData from "@/app/api/ai/openai";
export async function POST(req) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'method not allowed' }, { status: 405 })
    }

    const ingredientsToParse = await req.json();
    const ingredients = await nlpIngredients(ingredientsToParse)
   const ings = ingredients

    //const ingredients = await getOAIData(ingredientsToParse);
   // const ings = ingredients.ingredients
   //
   //   const aiIngredients = await getOAIData(ingredientsToParse)
   //  console.log('AI OUTPUT', aiIngredients)

    return NextResponse.json({ingredients: ings}, { status: 200 })
}