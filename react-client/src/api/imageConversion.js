import { writehtmlBacktoFile } from "./fileTools.js";
import { readFileSync } from 'fs';

export function imageToHTML(filepath){
    const img64 = readFileSync(filepath, {encoding: 'base64'});

    const extension = filepath.split('.')[-1]

    let htmlString = '<img src="data:image/' + extension + ';base64,' + img64 + '"/>'

    return htmlString
}

function testMain(){

    const html = imageToHTML("./resources/test_img.jpg")
    writehtmlBacktoFile(html, "./resources/image_html.html")

}


//testMain()