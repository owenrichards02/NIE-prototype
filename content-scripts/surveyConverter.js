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
export default function prepareSurvey(json, surveyID){

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
            htmlOut += ('<li class="qna q_' + q_key + '">\n')
            htmlOut += ('\t<p class="question"><b>' + q_key + "</b></p>\n")
            htmlOut += ('\t<p class="answer">' + answer + "</p>\n")
            htmlOut += ('</li>\n')

        }
        htmlOut += ('</ul>\n')
    }

    htmlOut += ('</div>\n')

    return htmlOut;
}