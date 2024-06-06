
import { readFile, readFileSync } from 'fs';
import { promises as fs } from "fs"
import { writehtmlBacktoFile } from './fileTools.js';
async function readTranscript(filepath){
    const ts = await fs.readFile(filepath, function (error, html) {
        if (error) {
          throw error;
        }
        return ts
    });

    //const fragContent = JSDOM.fragment(html).textContent
    //return fragContent

    return ts.toString()
}

export async function transcriptToHTML(filepath, interviewID){
    let html = '<div data-interviewID="' + interviewID + '">' + '\n'
    html += '<ul>\n'
    const transcript = await readTranscript(filepath)
    const tsLines = transcript.split('\n')

    for (let i = 0; i< tsLines.length -2; i+=3){
        html += '<li class="dialogue">\n'
        const speakerName = tsLines[i].split("  ")[0] //split on the double space
        const speakerTime = tsLines[i].split("  ")[1]
        const speech = tsLines[i+1]
        //ignore blank line
        html += '<p class="speaker"><b>' + speakerName + '</b></p><p class="timestamp">' + speakerTime + '</p>\n'
        html += '<p class="speech">' + speech + '</p>\n'


        html += '</li>\n'
    }

    html += '</ul>\n'
    html += '</div>\n'

    return html

    //console.log(transcript)
}


async function testMain(){
    const html = await transcriptToHTML("./resources/transcript_example.txt", "INTERVIEW_ID")
    writehtmlBacktoFile(html, "./resources/return_transcript.html")
}

//testMain()