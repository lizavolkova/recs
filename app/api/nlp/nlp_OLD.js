const ingredients = require('./_ingredients_test')
const winkNLP = require( 'wink-nlp' );
//const prepare = require( 'wink-nlp-utils' );
const ner = require('wink-ner');
const winkTokenizer = require('wink-tokenizer');
const posTagger = require( 'wink-pos-tagger' );
const  tagger = posTagger();
const tokenize = winkTokenizer().tokenize;

const myNER = ner();

// Load english language model.
const model = require( 'wink-eng-lite-web-model' );
const {patchConsoleError} = require("next/dist/client/components/react-dev-overlay/internal/helpers/hydration-error-info");
// Instantiate winkNLP.
const nlp_OLD = winkNLP( model );
// Obtain "its" helper to extract item properties.
const its = nlp_OLD.its;

// Obtain "as" reducer helper to reduce a collection.
const as = nlp_OLD.as;

const normalizeUnits = (ing) => {
    return ing
        .replace(/\b(c\.\s*|cups|C|c)\b/g, 'cup ')
        .replace(/\b(oz|ounces)\b/g, 'ounce')
        .replace(/\b(lb\.\s*|pounds|lb|lbs)\b/g, 'pound ')
        .replace(/\b(tbsp\.\s*|tbs|tbsp|tablespoons)\b/g, 'tablespoon ')
        .replace(/\b(tbs\.\s*|tsp|teaspoons)\b/g, 'teaspoon ')
        .replace(/\b(qt|quarts|qts)\b/g, 'quart')
        .replace(/\b(grams|g)\b/g, 'gram')
        .replace(/\b(kilograms|kg|kgs)\b/g, 'kilogram')
        .replace(/\b(milligrams|mgs|mg)\b/g, 'milligram')
        .replace(/\b(milliliters|ml|mls)\b/g, 'milliliter')
        .replace(/\b(liters|litre|litres|l)\b/g, 'liter')
        .replace(/(\,.*)/,' ')
        .replace(/(\or\s.*)/,' ')
        .replace(/\s*\(.*?\)\s*/g,' ')
}
// UNITS
// heads, sliced, clove
// [cardinal] [unit] [ingredient]
const ANY = ' [|ADJ|ADP|ADV|ADV|AUX|CCONJ|DET|INTJ|NOUN|NUM|PART|PRON|PROPN|PUNCT|SCONJ|SYM|VERB|X]';
const ANY_ING = ' [|ADJ|ADV|NOUN|PROPN|PUNCT|VERB]';
const otherMeasurements = '[bowl|bulb|cube|clove|cloves|drop|pinch|stick|sticks|piece|pieces|pcs|can|box|bag|bags]'
const spoons = '[tbsp|tbsp|tsp|tsp|tablespoons|teaspoon|teaspoons]'
const cups = '[cup|cups|c|c.]'
const imperial = '[oz|ounces|pound|pounds|lb|lbs|lb.|quart|qt|quarts|qt|qts]'
const unitTest = '[tbsp|tbsp.|tsp|tsp.|tablespoons|teaspoon|teaspoons|t]'
const grams = '[gram|g|kilogram|kg|milligram|mg|milliliter|ml|liter|liters|litre|litres|l]'
const patterns = [
    { name: 'cardinal', patterns: ['[CARDINAL]'] },
    // { name: 'quantity', patterns: [ 'CARDINAL cup', 'CARDINAL cups', 'CARDINAL tea spoon', 'CARDINAL table spoon', 'CARDINAL tablespoons'] },
    //{ name: 'quantity', patterns: [ '[CARDINAL] [c|c.|tbsp|tbsp.|tsp|tsp.|cup|cups]']},
   // { name: 'unit', patterns: [ '[c|c.|tbsp|tbsp.|tsp|tsp.|cup|cups|tablespoons|teaspoon|teaspoons]']},
   // { name: 'unit', patterns: [ cups] },
   // { name: 'unit', patterns: [ imperial] },
   // { name: 'unit', patterns: [ unitTest] },
   // { name: 'unit', patterns: [ spoons] },
   { name: 'unit', patterns: [ otherMeasurements]},
   { name: 'unit', patterns: [ '[cup|ounce|pound|tablespoon|teaspoon|quart|gram|kilogram|milligram|milliliter|liter]' ] },
    // { name: 'ingredient', patterns: [ '[|ADJ] sugar' ] },
    // { name: 'ingredient', patterns: [ 'freeze-dried [NOUN]' ] },
    // { name: 'ingredient', patterns: [ '[|NOUN] [|ADJ] [|NOUN] oil' ] },
    // { name: 'ingredient', patterns: [ 'salt' ] },
    // { name: 'ingredient', patterns: [ 'butter' ] },
    // { name: 'ingredient', patterns: [ 'vanilla extract' ] },
   // { name: 'ingredient', patterns: [ '[|ADJ] [|ADJ] [NOUN|PROPN]' ] },
    // { name: 'ingredient', patterns: [ '[|ADJ] [|VERB] [NOUN|PROPN]' ] }
    { name: 'ingredient', patterns: [ANY_ING] },
    { name: 'ingredientRaw', patterns: [ 'freeze-dried [NOUN]' ] },
    { name: 'ingredientRaw', patterns: [ '[NOUN]' ] },

];
nlp_OLD.learnCustomEntities(patterns);

const nerTrainingData = [
    { text: 'extra virgin olive oil', entityType: 'ingredient'}
]

myNER.learn( nerTrainingData );

const textIng = '2 c. shredded red cabbage, 6 tbsp. lime juice'
//console.log(textIng.replace(/(c\.|tbsp\.)/g, 'unit'))

const ingredientStringsToIgnore = ['kosher', 'salted', 'purpose', 'kitchen', 'chopped', 'sliced', 'diced', 'thin', 'large', 'small', 'medium', 'ground', 'fresh']
const test = ingredients.map(ing => {
    const doc = nlp_OLD.readDoc( normalizeUnits(ing) );
    const qty = doc.customEntities()
        .filter(( e ) => ( e.out( its.type ) === 'cardinal'))
        .out( its.pos )
        .join('-')

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

    // let tokens = tokenize(ingredient);
    // //tokens = myNER.recognize(tokens)
    // const testing = tagger.tagSentence(ingredient).filter(ing => {
    //    // console.log(ing)
    //     return ing.pos === 'NN' || ing.pos === 'NNP' || ing.pos === 'NNS' || ing.pos === 'JJ'
    // }).map(ing => ing.lemma)
    // console.log(testing.join(' '))


    return {
        // qty,
        // unit,
        // ingredient,
        ingredientRaw
    }
})

console.log(test)

// const text = `1 tbs. milk.
// 3 tbs unsweetened bakers chocolate
// 2 tbs. of sugar.
// 1/4 tsp. almond extract.
// 1 c. milk.
// 2 tbs. whipped cream (for garnish).`
// const doc = nlp.readDoc( text );
// console.log( doc.customEntities().out( its.detail) );


// THIS WORKS!!
// const text = 'I wish to order 12 small classic with corn topping and 2 large supreme with Olives, Onion topping.';
// const pizza = [
//     { name: 'Category', patterns: [ '[Classic|Supreme|Extravaganza|Favorite]' ] },
//     { name: 'Qty', patterns: [ 'CARDINAL' ] },
//     { name: 'Topping', patterns: [ '[Corn|Capsicum|Onion|Peppers|Cheese|Jalapenos|Olives]' ] },
//     { name: 'Size', patterns: [ '[Small|Medium|Large|Chairman|Wedge]' ] }
// ];
//
// nlp.learnCustomEntities( pizza, {
//     matchValue: false,
//     usePOS: true,
//     useEntity: true
// } );
// const doc = nlp.readDoc(text )
// console.log(doc.out())
// const customEntities = doc.customEntities().out( its.detail );
// console.log(customEntities)