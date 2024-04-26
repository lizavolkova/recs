import { NextResponse } from 'next/server'
import scrapeRecipe from "@/app/api/_utils/scrapeRecipe";
import openGraphScraper from "@/app/api/scrape/openGraphScareper";
import nlpIngredients from "@/app/api/nlp/nlp";
import getOAIData from "@/app/api/ai/openai";
import {getAIData} from "@/app/api/ai/openai";
const getScrapedData = async(url) => {
    try {
        const data = await scrapeRecipe(url)
        const openGraphData = await openGraphScraper(url)
        return { data, openGraphData }
    } catch(e) {

    }
}

export async function POST(req) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'method not allowed' }, { status: 405 })
    }

    const url = await req.json();
    // Step 1: Scrape the Recipe, get @graph tags and open graph tags
    // return basic data about the recipe, including ingredients
    const { data, openGraphData } = await getScrapedData(url);

    const ingredients = data.recipeIngredient

    // Step 2: Get the ingredients from the recipe, and run them through the NLP
    // return an object of ingredients parsed by qty, unit, text,
    const ingredientsParsed = await nlpIngredients(ingredients)

    // Step 3: Run just ingredient text through AI to get main Ingredients Array for DB
    const rawIngredients = ingredientsParsed.map(ing => ing.ingredient)
    const { mainIngredients } = await getOAIData(rawIngredients)

    // Step 4: Get ingredients from Step 1 and get cuisine, dish type, and health labels from AI
    const {dishType, healthLabels} = await getAIData(ingredients)
    // Step 5: Save recipe to DB


    return NextResponse.json({ingredients, openGraphData, ingredientsParsed, mainIngredients, dishType, healthLabels}, { status: 200 })
}