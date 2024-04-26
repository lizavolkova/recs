const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// ...

const model = genAI.getGenerativeModel({ model: 'gemini-pro'});

async function run(ingredients) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    // const prompt = `Parse this ingredient list and return a JSON array with [quantity] [unit] [ingredient]:
    // ${ingredients}
    // `

    const prompt = `Given this ingredient list, return a JSON array [allergens] [dietaryRestrictions] for this recipe: ${ingredients}`

    const result = await model.generateContent(prompt);
    const response = await result.response;
     return response.text()
//     console.log(text);
 }

export default async function getGeminiData(ingredients) {
    return run(ingredients)
}