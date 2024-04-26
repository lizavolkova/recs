import { NextResponse } from 'next/server'

export async function POST(req) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'method not allowed' }, { status: 405 })
    }

    return NextResponse.json({}, { status: 200 })
}

export async function GET(req) {
    //CALORIES NINJA
    // try {
    //     const ingredient = `black pepper`;
    //
    //     const test = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${ingredient}`, {
    //         headers: {
    //             'X-Api-Key': process.env.CALORIE_NINJA_API_KEY
    //         }
    //     });
    //     const jsonTest = await test.json()
    //     return NextResponse.json(jsonTest, { status: 200 })
    // } catch(e) {
    //     console.error(e)
    // }

   // EDAMAM
    try {
        const ingr =  [
            "8 oz firm tofu, drained",
            "1 sweet potato, peeled and cubed",
            "1 onion, sliced",
            "2 cloves garlic, minced",
            "1 tablespoon peanut or vegetable oil",
            "1 cup chickpeas, drained",
            "½ teaspoon salt, plus more to taste",
            "½ teaspoon pepper, plus more to taste",
            "1 teaspoon chili powder",
            "1 teaspoon garlic powder",
            "1 ½ cups cooked quinoa",
            "1 cup leafy greens, such as mesclun, baby kale, or spinach",
            "¼ cup shredded carrots, shredded",
            "1 avocado, diced",
            "Juice of 1 lemon",
            "2 tablespoons vegetable oil",
            "½ teaspoon sesame oil",
            "1 teaspoon hot sauce",
            "2 teaspoons dried thyme",
            "1 teaspoon paprika",
            "½ teaspoon salt"
        ];

        console.log(JSON.stringify({ingr}))

        const test = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=${process.env.EDAMAM_ID}&app_key=${process.env.EDAMAM_API_KEY}`, {
            method: 'POST',
            headers: {
                'accept': 'application/json'
            },
            body: JSON.stringify({ingr})
        });
        const jsonTest = await test.json()
        return NextResponse.json(jsonTest, { status: 200 })
    } catch(e) {
        console.error(e)
    }


    //SUGGESTIC
    // const client = new Suggestic("{TOKEN}");
    // try {
    //     const test = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=spinach&api_key=${process.env.USDA_API_KEY}`, {
    //         headers: {
    //             'accept': 'application/json'
    //         }
    //     });
    //     const jsonTest = await test.json()
    //     return NextResponse.json(jsonTest, { status: 200 })
    // } catch(e) {
    //     console.error(e)
    // }
    //

//&dataType=&pageSize=25&pageNumber=2&sortBy=dataType.keyword&sortOrder=asc&brandOwner=Kar%20Nut%20Products%20Company
//     const dataType= 'Foundation'
//     const pageSize = 25
//     const pageNumber = 1;
// const sortBy = 'dataType.keyword'
//     const sortOrder = 'asc'
//     const brandOwner = ''
//
//     const query = '+Brussels +sprouts'
//     // USDA
//     try {
//         const test = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}`, {
//             method: 'POST',
//             headers: {
//                 'accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             // body: '{\n  "query": "Cheddar cheese",\n  "dataType": [\n    "Foundation",\n    "SR Legacy"\n  ],\n  "pageSize": 25,\n  "pageNumber": 2,\n  "sortBy": "dataType.keyword",\n  "sortOrder": "asc",\n  "brandOwner": "Kar Nut Products Company",\n  "tradeChannel": [\n    "\u201CCHILD_NUTRITION_FOOD_PROGRAMS\u201D",\n    "\u201CGROCERY\u201D"\n  ],\n  "startDate": "2021-01-01",\n  "endDate": "2021-12-30"\n}',
//             body: JSON.stringify({
//                 'query': 'spinach',
//                 'dataType': [
//                     'Foundation',
//                     'SR Legacy'
//                 ],
//                 'pageSize': 25,
//                 'pageNumber': 1,
//                 'sortBy': 'publishedDate',
//                 'sortOrder': 'asc',
//                 'brandOwner': '',
//                 'startDate': '2021-01-01',
//                 'endDate': '2021-12-30'
//             })
//         });
//
//         // const test = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&dataType=${dataType}&pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=${sortBy}&sortOrder=${sortOrder}&brandOwner=${brandOwner}&api_key=${process.env.USDA_API_KEY}`, {
//         //     headers: {
//         //         'accept': 'application/json'
//         //     }
//         // });
//         const jsonTest = await test.json()
//         return NextResponse.json(jsonTest, { status: 200 })
//     } catch(e) {
//         console.error(e)
//     }


   // // FATSECRET
   //  const options = {
   //      method: 'POST',
   //      auth : {
   //          user : process.env.FATSECRET_CLIENT_ID,
   //          password : process.env.FATSECRET_CLIENT_SECRET
   //      },
   //      headers: { 'content-type': 'application/x-www-form-urlencoded'},
   //      form: {
   //          'grant_type': 'client_credentials',
   //          'scope' : 'basic'
   //      },
   //      json: true
   //  };
   //
   //  try {
   //      const test = await fetch('https://oauth.fatsecret.com/connect/token', options)
   //      const jsonTest = await test.json()
   //      return NextResponse.json(jsonTest, { status: 200 })
   //  } catch(e) {
   //      console.log(e)
   //      return NextResponse.json(e, { status: 200 })
   //  }


}
