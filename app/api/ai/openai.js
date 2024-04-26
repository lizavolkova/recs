const OpenAI = require("openai")

const openai = new OpenAI({
    organization: process.env.OPEN_AI_ORGID,
    apiKey: process.env.OPEN_AI_KEY,
});

const ingr =  [
    "9 mini cucumber",
    "&#188; cup fresh cilantro",
    "&#188; cup roasted unsalted peanuts",
    "1 Tbsp toasted sesame seeds",
    "3 Tbsp peanut butter",
    "1 Tbsp sodium-reduced soy sauce",
    "&#189; lime",
    " agave syrup",
    "&#190; tsp garlic powder",
    "1 Tbsp water",
    "1 Tbsp crispy chili oil"
];

// Return an additional field called raw_ingredient that returns just the basic ingredient that can be stored in a database for search.
async function ingredientParse(ingredients ) {
    // You will be provided with a list of ingredients, and your task is to return a JSON object that extracts quantity, unit of measure, and the ingredient from the data.
    //     Unit should be a standard unit of measure.
    //     The quantity field must be a number.
    //     If there is a min and max for quantity, use the min as the main quantity and add an additional field for max quantity.
    //     The ingredient field should just be the plain, basic ingredient that can be stored in a database.
    //     Any additional descriptors can be returned in a new option field called additional_info.
    //     Ignore any text inside parentheses.
    //     If an ingredients says cloves garlic, then make cloves the unit of measure. If an ingredient mentions cloves, but does not mention garlic, then cloves is the main ingredient.
    //
    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
                role: "system",
                content: `You will be provided with a list of recipe ingredients, and your task is to return a JSON array of just the main cooking ingredient from each recipe ingredient.
                Exclude any adjectives such as "vegan," but include ones such as "powder" or "fresh"
                The output should have the format mainIngredients: ["ingredient", "ingredient", ...]
                `
            },
            {
                role: 'user',
                content: ingredients.toString()
            }
            ],
        response_format: { type: "json_object" }
    });


    return JSON.parse(completion.choices[0].message.content)
}



const custom_functions = [
    {
        type: 'function',
        function: {
            name: 'get_health_labels',
            description: 'Get health labels for a set of ingredients',
            parameters: {
                type: 'object',
                properties: {
                    MEDITERRANEAN: {
                        type: 'string',
                        description: 'Mediterranean diet friendly ingredients'
                    },
                    VEGAN: {
                        type: 'string',
                        description: 'vegan ingredients'
                    },
                    VEGETARIAN: {
                        type: 'string',
                        description: 'vegetarian ingredients'
                    }
                }
            }
        }
    }
]

const tags = {
    MEDITERRANEAN: 'return true if the ingredients are Mediterranean diet friendly',
    VEGAN: "vegan",
    VEGETARIAN: 'vegetarian',
    DAIRY_FREE: 'dairy free',
    RED_MEAT_FREE: ' red meat free',
    NUT_FREE: 'nut free',
    GLUTEN_FREE: 'gluten free',
    PALEO: 'paleo',
    FODMAP_FREE: 'no FODMAP foods',
    PESCATARIAN: 'true if all ingredients are pescatarian diet friendly'
}

async function labelRecipe(ingredients) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
                role: "system",
                content: `You will be provided with a list of ingredients, and your task is to return a JSON object of the health labels that are true for this ingredient list.
                The returned JSON array should follow the following format: ${JSON.stringify(tags)}
                The values of the object should be boolean true false, and the evaluation criteria should follow the formatting example.
                `
            },
            {
                role: 'user',
                content: `
                Ingredients: ${ingredients.toString()}.`
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0
    });

    return JSON.parse(completion.choices[0].message.content)
}

const dishTypeLabels = [
    "bread",
    "dessert",
    "pies and tarts",
    "salad",
    "sandwich",
    "seafood",
    "side dish",
    "main course",
    "soup",
    "special occasion",
    "starter or appetizer",
    "sweet",
    "pasta",
    "egg",
    "drink",
    "condiment or sauce"
]
async function defineDishType(ingredients) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
                role: "system",
                content: `You will be provided with a list of ingredients, and your task is to return a JSON object of the type of dish that these ingredients create.
                The returned data should be a JSON array that contains any number of these labels that are true: ${dishTypeLabels.toString()}
                `
            },
            {
                role: 'user',
                content: `
                Ingredients: ${ingredients.toString()}.`
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0
    });

    return JSON.parse(completion.choices[0].message.content)
}

export default async function getOAIData(ingredients) {
    return await ingredientParse(ingredients)
}

export async function getAIData(ingredients) {
    // await MedTest(ingredients)
    //await PescTest(ingredients)
    const dishType = await defineDishType(ingredients)
    const healthLabels = await labelRecipe(ingredients)

    return {
        dishType: dishType.dish_types,
        healthLabels
    }
}