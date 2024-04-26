import ogs from 'open-graph-scraper'

export default async function openGraphScraper(url)  {
    const options = { url };

    const data =  await ogs(options)
    const { error, html, result, response } = data;
    return result;

}