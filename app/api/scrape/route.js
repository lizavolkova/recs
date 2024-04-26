import { NextResponse } from 'next/server'
import scrapeRecipe from "@/app/api/_utils/scrapeRecipe";
import openGraphScraper from "@/app/api/scrape/openGraphScareper";

export async function POST(req) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'method not allowed' }, { status: 405 })
    }

    const url = await req.json();
    const scrapedData = await scrapeRecipe(url)

    if (!scrapedData) {
        return NextResponse.json({error: 'Error scraping page'}, { status: 500 })
    }

    const { name, description, recipeYield, recipeCategory, recipeCuisine, recipeIngredient } = scrapedData

    const openGraphData = await openGraphScraper(url)

    return NextResponse.json({
        ingredients: recipeIngredient,
        name,
        description,
        recipeYield,
        recipeCategory,
        recipeCuisine,
        openGraphData
    }, { status: 200 })
}