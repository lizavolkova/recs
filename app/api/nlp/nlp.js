import getOAIData from "@/app/api/ai/openai";

const ingredients = require('./_ingredients_test')
const { units, descriptors } = require('./data')

//const extractRawIngredient = require('./extractRawIngredient');
const winkNLP = require( 'wink-nlp' );
const posTagger = require( 'wink-pos-tagger' );
const ner = require( 'wink-ner' );
const  tagger = posTagger();
const myNER = ner();

// Load english language model.
const model = require( 'wink-eng-lite-web-model' );

// Instantiate winkNLP.
const nlp = winkNLP( model );
// Obtain "its" helper to extract item properties.
const its = nlp.its;


const vulgarFractions = {
    '¼': '1/4',
    '½': '1/2',
    '¾': '3/4',
    '⅐': '1/7',
    '⅑': '1/9',
    '⅒': '1/10',
    '⅓': '1/3',
    '⅔': '2/3',
    '⅕': '1/5',
    '⅖': '2/5',
    '⅗': '3/5',
    '⅘': '4/5',
    '⅙': '1/6',
    '⅚': '5/6',
    '⅛': '1/8',
    '⅜': '3/8',
    '⅝': '5/8',
    '⅞': '7/8'
};
const normalizeUnits = (ing) => {
    // // if the ingredient quantity is of the format NUM x NUM, then math the total quantity
    // const multiplier = ing.match(/([0-9]\s*x\s*[0-9]+)/) //find 1 x 150
    // if (multiplier) {
    //     const equation = multiplier[0].toLowerCase().replace('x','*');
    //     const value = eval(equation)
    //     ing = ing.replace(/([0-9]\s*x\s*[0-9]+)/g, value)
    // }hj
  // console.log(ing.replace(/([0-9]+)[-|x]([0-9]+)/g, 'TEST - THREE'))

    //if there is a 1x200, then replace with 1 x 200
    //NLP doesn't parse unless there's a space between the x and the numbers
    // const string = /([0-9]+)[x]([0-9]+)/.exec(ing);
    // if (string) {
    //     ing = ing.replace(/([0-9]+)[x]([0-9]+)/, `${string[1]} x ${string[2]}`)
    // }

    //deal with numerical character references (sometimes vulgar fractions are encoded this way)
    const regex_num_set = /&#(\d+);/g;
    ing = ing.replace(regex_num_set, (_, $1) => {
        return String.fromCharCode($1)
    })

    // deal with Vulgar fractions
    // // todo: clean up the variable names
    const vulgarFractionRegex = /[\u00BC-\u00BE\u2150-\u215E]+/g
    const hasVulgarFraction = vulgarFractionRegex.exec(ing)
    if (hasVulgarFraction) {
        ing = ing.replace(vulgarFractionRegex, ` ${vulgarFractions[hasVulgarFraction[0]]}`)
    }

    return ing
        .normalize('NFD')
        // .replace(/\b(c\.\s*|cups|C|c)\b/g, 'cup ')
        // .replace(/\b(oz|ounces)\b/g, 'ounce')
        // .replace(/\b(lb\.\s*|pounds|pound|lbs)\b/g, 'lb ')
        // .replace(/\b(tbsp\.\s*|tbs|tbsp|tablespoons)\b/g, 'tablespoon ')
        // .replace(/\b(tbs\.\s*|tsp|teaspoons)\b/g, 'teaspoon ')
        // .replace(/\b(qt|quarts|qts)\b/g, 'quart')
        // .replace(/\b(grams|g)\b/g, 'gram')
        // .replace(/\b(kilograms|kg|kgs)\b/g, 'kilogram')
        // .replace(/\b(milligrams|mgs|mg)\b/g, 'milligram')
        // .replace(/\b(milliliters|ml|mls)\b/g, 'milliliter')
        // .replace(/\b(liters|litre|litres|l)\b/g, 'liter')
        // .replace(/\b(clove\sgarlic|cloves\sgarlic)\b/g, 'whole garlic')
        // .replace(/\b(garlic\sclove|garlic\scloves)\b/g, 'whole garlic')
       // .replace(/([\s]*[(][^)]*[)])\)*/g,' ')
       // .replace(/(\,.*)/,' ')
       // .replace(/-/g, ' - ')
       // .replace(/\s(\or\s.*)/,' ')
        //.replace(' ',' ')
        //.replace(/[\u0300-\u036f]/g, '')

}

const otherMeasurements = '[bowl|bulb|cube|drop|pinch|stick|sticks|piece|pieces|pcs|can|box|bag|bags|slice|slices|small|medium|large|whole|stalk|container|package]'

const patterns = [
    { name: 'cardinal', patterns: ['[CARDINAL]'] },
    { name: 'cardinal', patterns: ['[CARDINAL] [-|x] [CARDINAL]'] },
    { name: 'unit', patterns: [ otherMeasurements]},
    { name: 'unit', patterns: [ '[cup|ounce|lb|tablespoon|teaspoon|quart|gram|kilogram|milligram|milliliter|liter]' ] },
   // { name: 'unit', patterns: [ '[cloves] garlic' ], mark: [0,0] },
   // { name: 'ingredient', patterns: [ '[ADJ|ADV|NOUN|PROPN|PUNCT|VERB|CCONJ]' ] },
     {name: 'ingredientRaw', patterns:[ '[short|long] [-] [grain] rice'] },
     { name: 'ingredientRaw', patterns: [ 'freeze-dried [NOUN]' ] },
     { name: 'ingredientRaw', patterns: [ 'free-range [NOUN]' ] },
     { name: 'ingredientRaw', patterns: [ '[NOUN] [-] [NOUN|VERB]' ] },
     { name: 'ingredientRaw', patterns: [ '[|brown] sugar' ] },
     { name: 'ingredientRaw', patterns: [ '[kosher|sea] salt' ] },
     { name: 'ingredientRaw', patterns: [ 'Parmigiano' ] },
     { name: 'ingredientRaw', patterns: [ '[|heavy|sour] cream' ] },
     { name: 'ingredientRaw', patterns: [ '[|ADJ] onions' ] }, // todo: lemmma?
     { name: 'ingredientRaw', patterns: [ '[|ADJ] onion' ] },
     { name: 'ingredientRaw', patterns: [ '[|NOUN] [stock|broth]' ] },
     { name: 'ingredientRaw', patterns: [ '[|garlic] cloves' ] },
     { name: 'ingredientRaw', patterns: [ '[|NOUN|ADJ] garlic' ] },
     { name: 'ingredientRaw', patterns: [ '[|white|red] wine' ] },
     { name: 'ingredientRaw', patterns: [ '[|ADJ|PROPN] sauce' ] },
     { name: 'ingredientRaw', patterns: [ '[|ADJ|PROPN] stock' ] },
     { name: 'ingredientRaw', patterns: [ '[|ADJ|NOUN] chile' ] },
     { name: 'ingredientRaw', patterns: [ ' chile [|ADJ|NOUN]' ] },
     { name: 'ingredientRaw', patterns: [ '[|ADJ|NOUN] leaves' ] },
     { name: 'ingredientRaw', patterns: [ '[dried] [NOUN]' ] },
     { name: 'ingredientRaw', patterns: [ '[|ADJ|NOUN] beans' ] },
     { name: 'ingredientRaw', patterns: [ '[|NOUN|ADJ] [oil]' ] },
     { name: 'ingredientRaw', patterns: [ '[|ADJ|NOUN] [pepper|peppercorns]' ] },
     { name: 'ingredientRaw', patterns: [ '[|NOUN|ADJ|PROPN] cheese' ] },
     { name: 'ingredientRaw', patterns: [ 'egg [|yolk|yolks|white|whites]' ] },
     { name: 'ingredientRaw', patterns: [ '[|ADJ|NOUN] extract' ] },
     { name: 'ingredientRaw', patterns: [ '[|NOUN] or [|NOUN]' ] },
     { name: 'ingredientRaw', patterns: [ '[NOUN]' ] },
];
nlp.learnCustomEntities(patterns);

const parseIngredients = (ingredients) => {
   return ingredients.map(ing => {


        const doc = nlp.readDoc( normalizeUnits(ing) );

        const quantity = doc.customEntities()
            .filter(( e ) => ( e.out( its.type ) === 'cardinal'))
            .out( its.pos )
            .join(' ')

     //  console.log(doc.customEntities().out( its.detail ))

        const unit = doc.customEntities()
            .filter(( e ) => ( e.out( its.type ) === 'unit'))
            .out( its.pos )

        const ingredient = doc.customEntities()
            .filter(( e ) => ( e.out( its.type ) === 'ingredient'))
            .out( its.pos )
            .join(' ')

        const ingredientRaw = doc.customEntities()
            .filter(( e ) => ( e.out( its.type ) === 'ingredientRaw'))
            .out( its.pos )
            .join(' ')



        // const testing = tagger.tagSentence(ingredientRaw).map(ing => {
        //     return ing.pos === 'NN' || ing.tag === 'NNS' || ing.tag === 'NN' ? ing.lemma : ing.value
        // }).join(' ')
        // console.log(testing)
       //console.log({ingredientRaw})
       //const ingredientRaw = extractRawIngredient(ingredient)
       // return ingredientRaw
        return {
            quantity,
           unit: unit[0],
            // ingredient,
            ingredient: ingredientRaw,
            flag: !quantity || !ingredientRaw
        }
    })
}

const nerTrainingData = [
        ...units.map(unit => {
        return { text: unit, entityType: 'unit'}
    }),
    ...descriptors.map(descriptor => {
        return { text: descriptor, entityType: 'descriptor'}
    })
]

myNER.learn(nerTrainingData)
const winkTokenizer = require( 'wink-tokenizer' );
const tokenize = winkTokenizer().tokenize;
const tag = tagger.tag

const parseNERIngredients = async (ingredients)  => {

    const rawIngredients = []
    const ingredientObj = ingredients.map(ingr => {
        let tokens = tokenize( normalizeUnits(ingr) );
        tokens = myNER.recognize(tokens)
        tokens = tag( tokens)

        let shouldSkip = false
        const ingredient = tokens.filter(token => {
            // return token.pos === 'CD' || token.entityType === 'unit' || token.pos === 'NN' || token.pos === 'NNS'
            // return token.entityType !== 'unit' && (token.pos === 'NN' || token.pos === 'NNS' || token.pos === 'JJ' || token.pos === 'NNP')
            if (shouldSkip) {
                return false;
            }
            // if we reach a with their, etc, then we don't need the rest of the text
            // if (token.pos === 'CC' || token.pos === 'PRP$') {
            //     shouldSkip = true;
            //     return false;
            // }
            return token.entityType !== 'unit' && token.pos !== 'CD' || (token.pos === 'CC' || token.pos === 'PRP$')
            //return token.entityType !== 'unit' && token.pos !== 'CD' && token.entityType !== 'descriptor'
        }).map(token => {
            return token.value
        }).join(' ')
        rawIngredients.push(ingredient)

        const doc = nlp.readDoc( ingredient );
        const ingredientRaw = doc.customEntities()
            .filter(( e ) => ( e.out( its.type ) === 'ingredientRaw'))
            .out( its.pos )
            .join(' ')

        // assume quantity is always at beginning of ingredient
        let stopQtyCount = false
        let reachedNum = false
        const quantity = tokens.filter(token => {
            if (stopQtyCount) {
                return false;
            }

            if (token.pos !== 'CD' && reachedNum) {
                stopQtyCount = true
                return false;
            }

            if (token.pos === 'CD') {
                reachedNum = true
                return true
            }
        }).map(token => {
            return token.value
        }).flat(' ')


        const unit = tokens.filter(token => {
            return token.entityType === 'unit'
        }).map(token => {
            return token.value
        })


        return {
            quantity,
            unit: unit[0],
            ingredient
        }
    })

    //const aiIngredients = await getOAIData(rawIngredients)
    //console.log('AI output', aiIngredients)

    return ingredientObj;

    // return ingredientObj.map((ingredient, i) => {
    //     return {
    //         ...ingredient,
    //         mainIngredient: aiIngredients.mainIngredient[i]
    //     }
    // })
}
//console.log(parseIngredients(ingredients))
// parseIngredients(ingredients)
export default async function nlpIngredients(ingredients) {
    return parseNERIngredients(ingredients)
    // return parseIngredients(ingredients.ingredients)
}