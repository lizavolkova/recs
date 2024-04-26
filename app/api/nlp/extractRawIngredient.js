const winkNLPTwo = require( 'wink-nlp' );
const model = require( 'wink-eng-lite-web-model' );
const nlpTwo = winkNLPTwo( model );

const patternsTwo = [
    { name: 'ingredientRaw', patterns: [ '[NOUN] [PUNCT] [NOUN|VERB]' ] },
    { name: 'ingredientRaw', patterns: [ '[|brown] sugar' ] },
    { name: 'ingredientRaw', patterns: [ 'cloves' ] },
    { name: 'ingredientRaw', patterns: [ '[|heavy] cream' ] },
    { name: 'ingredientRaw', patterns: [ 'garlic' ] },
    { name: 'ingredientRaw', patterns: [ '[|ADJ] oil' ] },
    { name: 'ingredientRaw', patterns: [ '[NOUN]' ] },
];
nlpTwo.learnCustomEntities(patternsTwo);

const extractRawIngredient = (ingredient) => {

}

module.exports = extractRawIngredient