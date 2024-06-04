import { crud_addNewDocument, crud_addNewFragment, crud_deleteDoc, crud_deleteFragment, crud_getAllFragments, crud_getDocument, crud_getFragment} from './CRUD.js';

import { JSDOM } from 'jsdom';

import { gethtmlFromFile, getBinaryFromFile, writehtmlBacktoFile } from "./fileTools.js"
import { extractElementsContainingText } from './htmlTools.js';

//returns the id mongodb assigned to the document
export async function docAdd(filepath) { 
    let id
    if (filepath.split(".").at(-1) == 'html'){
        const thishtml = await gethtmlFromFile(filepath)
        id = await docAdd_html(thishtml, filepath)
    }else{
        const thisdata = await getBinaryFromFile(filepath)
        id = await docAdd_data(thisdata, filepath)
    }
    return id
}

//auto adds textual fragments if the doc is html
//returns the id mongodb assigned to the document with a list of fragment ids
export async function docAdd_autoTextFrag(filepath) { 
    let id = null
    let fragIds = []
    if (filepath.split(".").at(-1) == 'html'){
        const thishtml = await gethtmlFromFile(filepath)
        id = await docAdd_html(thishtml, filepath)

        const frags = await extractElementsContainingText(thishtml)
        for (const frag of frags){
            const fragId = await fragmentAdd_html(frag, id, "Auto-extracted textual fragment")
            fragIds.push(fragId)
        }

    }else{
        const thisdata = await getBinaryFromFile(filepath)
        id = await docAdd_data(thisdata, filepath)
    }
    return [id, fragIds]
}


//N.B. returns a list either html strings or 
export async function getKnownFragmentsFromDoc(doc_id){
    const rawFragList = await crud_getAllFragments(doc_id)
    let htmlfragList = []
    let binaryfragList = []

    for (const frag of rawFragList){
        if (frag.html != null){
            htmlfragList.push(frag.html)
        }else{
            binaryfragList.push(frag.data)
        }
    }

    const fragments = {
        binaryDataFrags : binaryfragList,
        htmlfragList : htmlfragList
    }

    return fragments
}

//dont use this directly
async function docAdd_data(data, filepath) { 

    const filename = filepath.split("/").at(-1)

    const newdoc = {
        name: filename,
        data: data,
        html: null
    }

    const id = await crud_addNewDocument(newdoc)

    return id
}

//dont use this directly
async function docAdd_html(html, filepath) {

    const filename = filepath.split("/").at(-1)

    const newdoc = {
        name: filename,
        data: null,
        html: html
    }

    const id = await crud_addNewDocument(newdoc)

    return id
}

//returns the id mongodb assigned to the fragment
export async function fragmentAdd_html(html, docid, fragName="testFragment") { 

    const newfrag = {
        name: fragName,
        docid: docid,
        html: html,
        data: null
    }

    const id = await crud_addNewFragment(newfrag)

    return id
}

//returns the id mongodb assigned to the fragment
export async function fragmentAdd_data(data, docid, fragName="testFragment") { 

    const newfrag = {
        name: fragName,
        docid: docid,
        html: null,
        data: data
    }

    const id = await crud_addNewFragment(newfrag)

    return id
}

//returns the data/html representation of the fragment
export async function fragmentRetrieve(id) { 

    const newfrag = await crud_getFragment(id)
    if(newfrag.html != null){
        return newfrag.html
    }else if(newfrag.data != null){
        return newfrag.data
    }else{
        throw error("No binary data or html within this fragment")
    }
     
}


//returns the data/html representation of the doc
export async function docRetrieve(id) { 

    const newDoc = await crud_getDocument(id)
    if(newDoc.html != null){
        return newDoc.html
    }else if(newDoc.data != null){
        return newDoc.data
    }else{
        throw error("No binary data or html within this fragment")
    }
}


export async function deleteDoc(id){return await crud_deleteDoc(id)}

export async function deleteFrag(id){return await crud_deleteFragment(id)}