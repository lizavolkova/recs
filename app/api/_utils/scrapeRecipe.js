import * as cheerio from "cheerio";
import { parse } from "node-html-parser";

export default async function scrapeRecipe(url) {
    // const response = await fetch(url);
    // const body = await response.text();

    return  await fetch(url).then((response) =>
        response.text().then((responseHtml) => {
            const document = parse(responseHtml);
            // Create an ARRAY of elements containing the page's structured data JSON. Just one more step!
            const structuredData = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
            const structuredDataJson = structuredData.map((node) => JSON.parse(node.innerHTML)).flat();

            return findNode('Recipe', structuredDataJson)
        })
    );
}

function findNode (id, array) {
    for (const node of array) {
        if (node['@type'] && node['@type'].includes(id)) return node;
        if (node['@graph']) {
            const child = findNode(id, node['@graph']);
            if (child) return child;
        }
    }
}