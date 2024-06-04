import { load } from "cheerio";

export async function extractElementsContainingText(html){
    const $ = load(html, null, true)

    const outer = $("*").first().html().split('\n').filter(n => n)
    const innerText = $("*").first().text().split('\n').filter(n => n)

    let outerText = []
    for (const tag of outer){
        if (innerText.some(v => tag.includes(v))) {
            outerText.push(tag)
        }
    }

    return outerText

    //keeping outerHTML so that the fragments can be easily highlighted/selected
}