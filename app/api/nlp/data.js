const units = [
    "oz",
    "ounce",
    "pound",
    "lb",
    "lbs",
    "lbs.",
    "lb.",
    "c.",
    "cup",
    "cups",
    "tbs",
    "tbsp",
    "tbs.",
    "tbsp.",
    "tablespoon",
    "teaspoon",
    "tsp",
    "tsp.",
    "qt",
    "qts",
    "qts.",
    "quart",
    "g.",
    "gram",
    "g",
    "kilogram",
    "kg",
    "kg.",
    "kgs.",
    "kgs",
    "mgs",
    "mg",
    "milligram",
    "bowl","bulb","cube","drop","pinch","stick","piece","pieces","pcs","can","box","bag","slice","small","medium","large","whole","stalk","container","package",
    "wedge",
    "dollop",
    "packet",
    "sprig",
    "serving",
    "portion",
    "bunch",
    "strand"
]

const descriptors = [
    "chopped",
    "sliced",
    "diced",
    "minced",
    "peeled",
    "melted",
    "trimmed",
    "roasted",
    "homemade"
]

module.exports = {
    units,
    descriptors
}

//bowl|bulb|cube|drop|pinch|stick|sticks|piece|pieces|pcs|can|box|bag|bags|slice|slices|small|medium|large|whole|stalk|container|package

    // .replace(/\b(tbsp\.\s*|tbs|tbsp|tablespoons)\b/g, 'tablespoon ')
    // .replace(/\b(tbs\.\s*|tsp|teaspoons)\b/g, 'teaspoon ')
    // .replace(/\b(qt|quarts|qts)\b/g, 'quart')
    // .replace(/\b(grams|g)\b/g, 'gram')
    // .replace(/\b(kilograms|kg|kgs)\b/g, 'kilogram')
    // .replace(/\b(milligrams|mgs|mg)\b/g, 'milligram')
    // .replace(/\b(milliliters|ml|mls)\b/g, 'milliliter')
    // .replace(/\b(liters|litre|litres|l)\b/g, 'liter')