//import { readFile, utils } from "xlsx";

import pkg from 'xlsx';
import { writehtmlBacktoFile } from './fileTools.js';
const { readFile, utils } = pkg;

function excel_2_JSON(filepath){
    const book = readFile(filepath)
    //assume only the first sheet is relevant
    let sheetNames = book.SheetNames
    let jsonsheet = utils.sheet_to_json(book.Sheets[sheetNames[0]])
    return jsonsheet
}

/* 
Proposed HTML format for survey responses.

<div data-surveyID=’x’>
	<li data-responseID=’x’>
		<div>
	        <p class=”question”><b>questionText</b></p>
			<p class=”answer”>answerText<\p>
		</div>

    </li>
</div>

*/
function JSON_2_HTML(json, surveyID){

    //might need to exclude tab and newline characters

    //remove first row (contains full questions)
    let htmlOut = '<div data-surveyID="' + surveyID + '">\n'
    const titleRow = json.shift()

    //json = json.slice(1,2) //REMOVE AFTER TESTING!!
    //to test on the first good row

    for (const response of json){
        htmlOut += ('<ul data-responseID="' + response['ResponseId'] + '">\n')
        for (const q_key in response){
            let answer = response[q_key]
            htmlOut += ('<li class="qna">\n')
            htmlOut += ('\t<p class="question"><b>' + q_key + "</b></p>\n")
            htmlOut += ('\t<p class="answer">' + answer + "</p>\n")
            htmlOut += ('</li>\n')

        }
        htmlOut += ('</ul>\n')
    }

    htmlOut += ('</div>\n')


    return htmlOut
}

export function excelSurveyToHTML(filepath, surveyID){
    const jsonsheet = excel_2_JSON(filepath)
    //console.log(jsonsheet)
    const htmlout = JSON_2_HTML(jsonsheet, surveyID)
    return htmlout
}



function main(){
    let surveyID = 75 //TEST -- MAKE SURE TO GET THIS PROPERLY
    let filepath = "./resources/survey_example.xlsx"
    const htmlout = excelSurveyToHTML(filepath, surveyID)
    writehtmlBacktoFile(htmlout, "./resources/survey_out.html")

    //console.log(htmlout)
}

main()