import { load } from "cheerio";
import { excelSurveyToHTML } from "./surveyConversion.js";
import { transcriptToHTML } from "./transcriptConversion.js";



/**
 * Finds all HTML tags containing text and returns them, in a list of html tags
 *
 * @export
 * @param {string} html
 * @return {Array<string>} 
 */
export async function extractAllTextualFragments(html){
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


/**
 * Searches html representations of the .xlsx survey format, returning all questions and response pairs, denoted by the .qna class.
 * Returns a list of html strings
 *
 * @export
 * @param {string} html
 * @return {Array<string} 
 */
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


/**
 * Searches html representations of the known .txt transcript otter.ai format, returning all dialogue sections as a list, as dented by the .dialogue class.
 *
 * @export
 * @param {string} html
 * @return {Array<string>} 
 */
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



/**
 * Searches html and returns tag sections with a given attribute. Returns an array of html tags.
 *
 * @export
 * @param {string} html
 * @param {string} attribute
 * @return {Array<string>} 
 */
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


/**
 * Searches html and returns tag sections with a given attribute that matches the given value . Returns an array of html tags.
 *
 * @export
 * @param {string} html
 * @param {string} attribute
 * @param {string} value
 * @return {Array<string>} 
 */
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


/**
 * Searches html and returns tag sections where the value between the tag holds a certain value. Returns an array of html tags.
 *
 * @export
 * @param {string} html
 * @param {string} tag
 * @param {string} value
 * @param {string} t_class
 * @return {Array<string>} 
 */
export async function HTMLByTagValueContains(html, tag, value, t_class=null){
    let searchString = tag
    if (t_class != null){searchString += '.' + t_class}
    searchString += ':contains(\"' + value + '\")'
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
    const matches = await HTMLByTagValueContains(html, "li", "Q4", "qna")
    console.log(matches)
}



//extractionMain()