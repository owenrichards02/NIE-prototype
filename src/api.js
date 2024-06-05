import { crud_addNewDocument, crud_addNewFragment, crud_deleteDoc, crud_deleteFragment, crud_getAllFragments, crud_getDocument, crud_getFragment} from './CRUD.js';

import { JSDOM } from 'jsdom';

import { gethtmlFromFile, getBinaryFromFile, writehtmlBacktoFile } from "./fileTools.js"
import { HTMLByAttribute, HTMLByAttributeValue, extractAllInterviewDialogueSections, extractAllSurveyQuestions, extractAllTextualFragments } from './fragment.js';
import { Binary, ObjectId } from 'bson';
import { imageToHTML } from './imageConversion.js';
import { excelSurveyToHTML } from './surveyConversion.js';
import { transcriptToHTML } from './transcriptConversion.js';

import { existsSync } from 'fs';
import { sep } from 'path';


/**
 * Stores a document in the documents container.
 * Returns the id mongodb assigned to the document.
 * Keeps HTML native, embeds images, excel survey responses, and .txt interview transcripts in HTML, 
 * and stores other file types as binary
 *
 * @export
 * @param {string} filepath
 * @return {ObjectId} id
 */
export async function docAdd(filepath) { 

    if (!(existsSync(filepath))){
        throw new Error("File not found at " + filepath)
    }

    let id
    let extension = filepath.split(".").at(-1)
    
    if (extension == 'html'){
        const thishtml = await gethtmlFromFile(filepath)
        id = await docAdd_html(thishtml, filepath, "html")

    }else if (extension == "png" || extension == "jpg" || extension == "gif"){
        const thishtml = imageToHTML(filepath)
        id = await docAdd_html(thishtml, filepath, "image")

    }else if (extension == "xlsx"){
        let surveyId = "SURVEY_ID" //need to get this from the user somehow
        const thishtml = excelSurveyToHTML(filepath, surveyId)
        id = await docAdd_html(thishtml, filepath, "survey")

    }else if (extension == "txt"){
        let interviewID = "INTERVIEW_ID" //need to get this from the user somehow
        const thishtml = transcriptToHTML(filepath, interviewID)
        id = await docAdd_html(thishtml, filepath, "transcript")

    }else {
        const thisdata = await getBinaryFromFile(filepath)
        id = await docAdd_data(thisdata, filepath, "unknown")
    }
    return id
}


/**
 * Functionality of docAdd with automatic fragment extraction/storage
 * Auto adds extracted fragments if the doc is html or one of the html-convertible formats, and the doc as its own fragment otherwise.
 * Returns the id mongodb assigned to the document with a list of fragment ids
 * @export
 * @param {string} filepath
 * @return {Array.<ObjectId|Array.<ObjectId>>} 
 */
export async function docAdd_autoFrag(filepath) { 

    if (!(existsSync(filepath))){
        throw new Error("File not found at " + filepath)
    }

    let extension = filepath.split(".").at(-1)

    let id = null
    let fragIds = []
    if (extension == 'html'){
        const thishtml = await gethtmlFromFile(filepath)
        id = await docAdd_html(thishtml, filepath, "html")

        const frags = await extractAllTextualFragments(thishtml)
        console.log(frags)
        for (const frag of frags){
            const fragId = await fragmentAdd_html(frag, id, "Auto-extracted html fragment: " + filepath.split(sep), "html")
            fragIds.push(fragId)
        }

    }else if(extension=="png" || extension=="jpg" || extension=="gif"){
        //auto add entire image as a fragment
        const thishtml = imageToHTML(filepath)
        id = await docAdd_html(thishtml, filepath, "image")

        const fragid = await fragmentAdd_html(null, id, "Whole image: " + filepath.split(sep), "image", null)
        fragIds.push(fragid)


    }else if(extension == "xlsx"){
        let surveyId = "SURVEY_ID" //need to get this from the user somehow
        const thishtml = excelSurveyToHTML(filepath, surveyId)
        id = await docAdd_html(thishtml, filepath, "survey")

        const frags = await extractAllSurveyQuestions(thishtml)
        for (const frag of frags){
            const fragId = await fragmentAdd_html(frag, id, "Auto-extracted survey question: " + filepath.split(sep), "survey")
            fragIds.push(fragId)
        }
    

    }else if(extension == "txt"){
        let interviewID = "INTERVIEW_ID" //need to get this from the user somehow
        const thishtml = transcriptToHTML(filepath, interviewID)
        id = await docAdd_html(thishtml, filepath, "transcript")

        const frags = await extractAllInterviewDialogueSections(thishtml)
        for (const frag of frags){
            const fragId = await fragmentAdd_html(frag, id, "Auto-extracted transcript segment: " + filepath.split(sep), "transcript")
            fragIds.push(fragId)
        }
    
    }else{
        const thisdata = await getBinaryFromFile(filepath)
        id = await docAdd_data(thisdata, filepath, "unknown")
        //add doc as its own fragment

        const fragId = await fragmentAdd_data(thisdata, id, "Auto-extracted data fragment: "  + filepath.split(sep), "unknown")
        fragIds.push(fragId)
    }

    return [id, fragIds]
}

/** 
 * Finds all fragments currently linked to this document in the fragments container
 * Returns an object containing lists of both fragment types: HTML and Binary.
 *
 * @export
 * @param {ObjectId} doc_id
 * @return {Object.<string, Array<String|BinaryData>>} 
 */
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
async function docAdd_data(data, filepath, type) { 

    const filename = filepath.split("/").at(-1)

    const newdoc = {
        name: filename,
        data: data,
        html: null,
        type: type
    }

    const id = await crud_addNewDocument(newdoc)

    return id
}

//dont use this directly
async function docAdd_html(html, filepath, type) {

    const filename = filepath.split("/").at(-1)

    const newdoc = {
        name: filename,
        data: null,
        html: html,
        type: type
    }

    const id = await crud_addNewDocument(newdoc)

    return id
}

/**
 * Stores an HTML based fragment in the fragments container. Requires a documentID.
 * Returns the id mongodb assigned to the fragment
 *
 * @export
 * @param {string} html
 * @param {ObjectId} docid
 * @param {string} [fragName="testFragment"]
 * @return {ObjectId} 
 */
export async function fragmentAdd_html(html, docid, fragName="testFragment", type, coords = null) {

    //image embed removed, to avoid data duplication
    //source can be retrieved from the original docid.
    const altHtml = html
    if (type=="image"){
        altHtml = null
    }

    const newfrag = {
        name: fragName,
        docid: docid,
        html: altHtml,
        data: null,
        type: type,
        coords: coords
    }

    const id = await crud_addNewFragment(newfrag)

    return id
}


/**
 * Stores an non-HTML based fragment in the fragments container, as a binary object.
 * Requires a documentID.
 * Returns the id mongodb assigned to the fragment
 *
 * @export
 * @param {BinaryData} data
 * @param {ObjectId} docid
 * @param {string} [fragName="testFragment"]
 * @return {ObjectId} 
 */
export async function fragmentAdd_data(data, docid, fragName="testFragment", type) { 

    const newfrag = {
        name: fragName,
        docid: docid,
        html: null,
        data: data,
        type: type
    }

    const id = await crud_addNewFragment(newfrag)

    return id
}


/**
 * Fetches a fragment from the fragments container using the fragmentID.
 * Returns the data/html representation of the fragment
 *
 * @export
 * @param {ObjectId} id
 * @return {BinaryData|string} 
 */
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

//
/**
 * Fetches a document from the documents container using the documentID.
 * Returns the data/html representation of the doc.
 *
 * @export
 * @param {ObjectId} id
 * @return {BinaryData|string} 
 */
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



/**
 * Deletes a document from the documents container using a documentID. Returns a DeleteResult for confirmation.
 * WILL ALSO DELETE ALL FRAGMENTS LINKED TO THE DOC.
 *
 * @export
 * @param {ObjectId} id
 * @return {DeleteResult} 
 */
export async function deleteDoc(id){return await crud_deleteDoc(id)}


/**
 * Deletes a fragment from the fragments container using a fragmentID. Returns a DeleteResult for confirmation.
 *
 * @export
 * @param {ObjectId} id
 * @return {DeleteResult} 
 */
export async function deleteFrag(id){return await crud_deleteFragment(id)}


export async function searchByAttribute(docid, attribute){

    let matches = []
    const doc = await docRetrieve(docid)
    if (!(doc instanceof Binary)){
        matches = await HTMLByAttribute(doc, attribute)
    }else{
        console.error("No html inside this doc")
    }

    return matches

}

export async function searchByAttributeValue(docid, attribute, value){

    let matches = []
    const doc = await docRetrieve(docid)
    if (!(doc instanceof Binary)){
        matches = await HTMLByAttributeValue(doc, attribute, value)
    }else{
        console.error("No html inside this doc")
    }

    return matches
    
}