import { load } from "cheerio";
import { excelSurveyToHTML } from "./surveyConversion.js";
import { transcriptToHTML } from "./transcriptConversion.js";

export async function extractAllTextualFragments(html){
    let fragments = []
    const textFrags = await extractElementsContainingText(html)
    for (const frag of textFrags){
        fragments.push(frag)
    }

    return fragments
}

async function extractElementsContainingText(html){
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

export async function extractAllSurveyQuestions(html){
    const $ = load(html, null, true)
    const outer = $(".qna")

    let questions = []
    outer.each((index, element) => {
        var $this = $(element);
        questions.push($.html($this))
    })

    //console.log(outer.html())
    //console.log(outer)

    return questions
}

export async function extractAllInterviewDialogueSections(html){
    const $ = load(html, null, true)
    const outer = $(".dialogue")

    let dialogueList = []
    outer.each((index, element) => {
        var $this = $(element);
        dialogueList.push($.html($this))
    })

    //console.log(outer.html())
    //console.log(outer)

    return dialogueList
}

export async function HTMLByAttribute(html, attribute){
    let searchString = '[' + attribute + ']'
    console.log(searchString)
    const $ = load(html, null, true)
    const outer = $(searchString)

    let matches = []
    outer.each((index, element) => {
        var $this = $(element);
        matches.push($.html($this))
    })

    return matches
}


export async function HTMLByAttributeValue(html, attribute, value){
    let searchString = '[' + attribute + '=\'' + value + '\']'
    console.log(searchString)
    const $ = load(html, null, true)
    const outer = $(searchString)

    let matches = []
    outer.each((index, element) => {
        var $this = $(element);
        matches.push($.html($this))
    })

    return matches
}


async function extractionMain(){
    const html = excelSurveyToHTML("./resources/survey_example.xlsx", "testID")
    const matches = await HTMLByAttributeValue(html, "data-responseID", "R_3nT6Y0Sm27iTPaF")
    console.log(matches)
}



//extractionMain()