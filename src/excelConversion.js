//import { readFile, utils } from "xlsx";

import pkg from 'xlsx';
const { readFile, utils } = pkg;

function excel_2_JSON(filepath){
    const book = readFile(filepath)
    //assume only the first sheet is relevant
    let sheetNames = book.SheetNames
    let jsonsheet = utils.sheet_to_json(book.Sheets[sheetNames[0]])
    return jsonsheet
}


function main(){
    const jsonsheet = excel_2_JSON("./resources/survey_example.xlsx")
    console.log(jsonsheet[2])
}

main()