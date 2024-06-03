import { readFileSync, readFile, writeFile } from 'fs';

import { promises as fs } from "fs"

import { config } from 'dotenv';
config()

import { addNewDocument, addNewFragment, getDocument, getFragment} from './CRUD.js';

import { Binary } from "bson";

import { JSDOM } from 'jsdom';




//returns the id mongodb assigned to the document
async function testDocFileAdd(filepath) { 
    let file_data = null;
    try {
        file_data = readFileSync(filepath);
    } catch (error) {
        console.error('Error reading image file:', error);
    }

    const bin_data = new Binary(file_data)


    const filename = filepath.split("/").at(-1)

    const newdoc = {
        name: filename,
        data: bin_data,
    }

    const id = await addNewDocument(newdoc)

    return id
}

//returns the id mongodb assigned to the document
async function fragmentAdd(html, docid, fragName="testFragment") { 

    const newfrag = {
        name: fragName,
        docid: docid,
        html: html
    }

    const id = await addNewFragment(newfrag)

    return id
}

//returns the id mongodb assigned to the document
async function fragmentRetrieve(id) { 

    const newfrag = await getFragment(id)
    const html = newfrag.html
    
    return html
}


//returns the id mongodb assigned to the document
async function testDocFileRetrieve(id) { 

    const newDoc = await getDocument(id)
    const bin_data = newDoc.data
    
    return bin_data
}

async function gethtmlFromFile(filepath){

    const html = await fs.readFile(filepath, function (error, html) {
        if (error) {
          throw error;
        }
        return html
    });

    //const fragContent = JSDOM.fragment(html).textContent
    //return fragContent

    return html.toString()
}

async function writehtmlBacktoFile(html, filepath="return.html"){
    console.log("idk")
    writeFile(filepath, html, err => {
        if (err) {
            console.error(err);
        }
    });
}


async function main(){
   /*  const filepath = "./test_img.jpg"
    const id = await testDocFileAdd(filepath)

    //console.log("ID:", id)

    const bin_data = await testDocFileRetrieve(id)
    console.log("DATA:", (bin_data)) */
    

    const filepath = "./htmlExample.html"
    const send_html = await gethtmlFromFile(filepath)
    const id = await fragmentAdd(send_html, 'doc1', "Example PDF HTML section")

    const return_html = await fragmentRetrieve(id)
    writehtmlBacktoFile(return_html)
    //console.log("HTML:", return_html)
}

main()

