import { load } from "cheerio";


export async function query_jq(html, jqString){
    const $ = load(html, null, true)
    const outer = $(jqString)

    let matches = []
    outer.each((index, element) => {
        var $this = $(element);
        matches.push($.html($this))
    })

    return matches
}



export function extractAllTextualFragments(html){
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

export async function HTMLByTag(html, tag, t_class=null){
    let searchString = tag
    if (t_class != null){searchString += '.' + t_class}
    const $ = load(html, null, true)
    const outer = $(searchString)

    let matches = []
    outer.each((index, element) => {
        var $this = $(element);
        matches.push($.html($this))
    })

    return matches
}
