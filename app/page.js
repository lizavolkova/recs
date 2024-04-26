"use client"
import Image from "next/image";
import React, { useState } from 'react';
export default function Home() {
  const urls = [
      'https://www.seriouseats.com/mushroom-pasta-creamy',
      'https://www.seriouseats.com/double-bean-mazemen-broth-less-ramen-with-savory-beans',
      'https://www.seriouseats.com/lamb-biryani',
      'https://www.seriouseats.com/roasted-garlic-and-parmesan-rind-soup-5184259',
      'https://www.justonecookbook.com/oyakodon/',
      'https://natashaskitchen.com/classic-russian-borscht-recipe/',
      'https://tasty.co/recipe/3-ingredient-peanut-butter-cookies',
      'https://www.eatingwell.com/recipe/277767/falafel-tabbouleh-bowls-with-tzatziki',
      'https://tasty.co/recipe/protein-packed-buddha-bowl',
      'https://adventuresincooking.com/pumpkin-pie/',
      'https://www.halfbakedharvest.com/baked-crunchy-buffalo-chicken',
      'https://cooking.nytimes.com/recipes/1020631-thai-inspired-chicken-meatball-soup',
      'https://thewoksoflife.com/moo-shu-chicken',
      'https://www.themediterraneandish.com/kuku-sabzi-persian-baked-omelet/',
      'https://www.pickuplimes.com/recipe/chickpea-omelette-sandwich-33',
      'https://www.loveandlemons.com/sesame-tofu-recipe/',
      'https://www.pickuplimes.com/recipe/buffalo-chickpea-sandwich-1528',
      'https://www.fitfoodieselma.com/2021/01/04/vegan-chocolate-strawberry-protein-bites/',
      'https://rainbowplantlife.com/tofu-tikka-masala/',
      'https://rainbowplantlife.com/mediterranean-lentil-and-grain-bowls/',
      'https://www.foodandwine.com/recipes/al-pastor-fish-tacos',
      'https://www.eatingwell.com/recipe/262836/egg-sandwiches-with-rosemary-tomato-feta/',
      'https://honest-food.net/duck-pie-recipe/',
      'https://www.pickuplimes.com/recipe/peanut-chili-oil-cucumber-salad-1572'
  ]
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);
  const [rawIng, setRawIng] = useState([])
  const [labels, setLabels] = useState({})
    const [dishType, setDishType] = useState([])
    const [url, setUrl] = useState(urls[0])
    const [mainIngs, setMainIngs] = useState([])

  const submitData = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url')
    setLoading(true)
    setLabels({})
      setData([])
      setDishType([])

      const getScrapedData = await fetch('/api/parse', {
        method: 'POST',
        body: JSON.stringify(url)
      })
      const { dishType, healthLabels, ingredientsParsed, mainIngredients, ingredients } = await getScrapedData.json();

    // const getScrapedData = await fetch('/api/scrape', {
    //   method: 'POST',
    //   body: JSON.stringify(url)
    // })
    // const ingredients = await getScrapedData.json();
     setRawIng(ingredients)
      setMainIngs(mainIngredients)
    //
    // const getNPLIngredients = await fetch('/api/nlp', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredients)
    // })
    //
    // const nplIngredients = await getNPLIngredients.json();
     setData(ingredientsParsed)

    // const getAIData = await fetch('/api/ai', {
    //     method: 'POST',
    //     body: JSON.stringify(ingredients.ingredients)
    // })
    // const aiDataJson = await getAIData.json()
    setLabels(healthLabels)
    setDishType(dishType)
    setLoading(false)
  };

  console.log(rawIng)
  const edamTest = async() => {
      if (data) {
          // const ingr = ["1 cup rice,", "10 oz chickpeas", "1-2 chickens"];
          const ingr = data.map(ing => `${ing.qty} ${ing.unit[0]} ${ing.ingredientRaw}`)
          console.log(ingr)

          return await fetch('https://api.edamam.com/api/nutrition-details?app_id=4b0bf564&app_key=faf33a5efe52f8b83e1ed1771fa8e572', {
               method: 'POST',
               headers: {
                   'accept': 'application/json',
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({ingr})
           });
      }

  }

  return (
      <main className="flex items-center justify-between p-24 flex-col">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
              <button onClick={edamTest}
                      className="text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edam
                  Test
              </button>
              <form onSubmit={submitData} className="relative w-1/2">
                  <div className="relative mb-5">
                      <input type="search" id="search"
                             name="url"
                             className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                             placeholder="Url"
                             defaultValue={url}
                             required/>


                      <button type="submit"
                              disabled={loading}
                              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          <svg aria-hidden="true" role="status"
                               className={`${loading ? 'visible' : 'invisible'} inline w-4 h-4 me-3 text-white animate-spin`}
                               viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="#E5E7EB"/>
                              <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentColor"/>
                          </svg>
                          Submit
                      </button>
                  </div>


                  <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select
                      an option</label>
                  <select
                      onChange={e => setUrl(e.target.value)}
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      {urls.map(url => <option value={url} key={url}>{url}</option>)}
                  </select>
              </form>


          </div>

          <div className="w-full py-5">
              Recipe tags:
              <div>
                  {Object.keys(labels).filter(label => labels[label] === true).map(label => <span className="mr-5"
                                                                                                  key={label}>{label} </span>)}
              </div>
          </div>

          <div className="w-full py-5">
              Dish Type:
              <div>
                  {dishType.map(dish => <span className="mr-5" key={dish}>{dish} </span>)}
              </div>
          </div>

          <div className="w-full">
              <ul>
                  {data.map((ing, i) => {
                      return (
                          <li className={`mb-2 p-2 rounded-md ${ing.flag ? '!bg-red-950' : ''}`} key={i}>
                              <div c>
                                  <span className="font-bold">{ing.quantity}</span>
                                  <span className="text-red-200 ml-1">{ing.unit}</span>
                                  <span className="text-yellow-200 ml-1">{ing.ingredient}</span>
                                  <span className="text-green-200 ml-2 font-bold">{mainIngs[i]}</span>
                              </div>
                              <div className="text-xs text-gray-400">{rawIng[i]}</div>
                          </li>
                      )
                  })}
              </ul>

          </div>
      </main>
  );
}
