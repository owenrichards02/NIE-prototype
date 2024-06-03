import { config } from 'dotenv';
config()

import { addNewDocument, addNewFragment, getDocument, getFragment} from './CRUD.js';

import { JSDOM } from 'jsdom';

import { gethtmlFromFile, getBinaryFromFile, writehtmlBacktoFile } from "./fileTools.js"

//returns the id mongodb assigned to the document
export async function docAdd(filepath) { 
    let id = ''
    if (filepath.split(".").at(-1) == 'html'){
        const thishtml = await gethtmlFromFile(filepath)
        id = await docAdd_html(thishtml, filepath)
    }else{
        const thisdata = await getBinaryFromFile(filepath)
        id = await docAdd_data(thisdata, filepath)
    }
    return id
}

//dont use this directly
async function docAdd_data(data, filepath) { 

    const filename = filepath.split("/").at(-1)

    const newdoc = {
        name: filename,
        data: data,
        html: null
    }

    const id = await addNewDocument(newdoc)

    return id
}

//dont use this directly
async function docAdd_html(html, filepath) {

    const filename = filepath.split("/").at(-1)

    const newdoc = {
        name: filename,
        data: null,
    }

    const id = await addNewDocument(newdoc)

    return id
}


export async function fragmentAdd_html(html, docid, fragName="testFragment") { 

    const newfrag = {
        name: fragName,
        docid: docid,
        html: html,
        data: null
    }

    const id = await addNewFragment(newfrag)

    return id
}

export async function fragmentAdd_data(data, docid, fragName="testFragment") { 

    const newfrag = {
        name: fragName,
        docid: docid,
        html: null,
        data: data
    }

    const id = await addNewFragment(newfrag)

    return id
}

//returns the id mongodb assigned to the document
export async function fragmentRetrieve(id) { 

    const newfrag = await getFragment(id)
    if(newfrag.html != null){
        return newfrag.html
    }else if(newfrag.data != null){
        return newfrag.data
    }else{
        throw error("No binary data or html within this fragment")
    }
     
}


//returns the id mongodb assigned to the document
export async function docRetrieve(id) { 

    const newDoc = await getDocument(id)
    if(newDoc.html != null){
        return newDoc.html
    }else if(newDoc.data != null){
        return newDoc.data
    }else{
        throw error("No binary data or html within this fragment")
    }
}



