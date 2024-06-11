import { crud_TagItem, crud_addNewItem, crud_deleteDoc, crud_deleteFragment, crud_getAllAnnotations_fromSpecificFragment, crud_getAllFragments_fromSpecificDoc, crud_getItem, crud_searchByTagListAND, crud_searchByTagListOR} from './CRUD.js';

import { JSDOM } from 'jsdom';

import { gethtmlFromFile, getBinaryFromFile, writehtmlBacktoFile } from "./fileTools.js"
import { HTMLByAttribute, HTMLByAttributeValue, HTMLByTag, HTMLByTagValueContains, extractAllInterviewDialogueSections, extractAllSurveyQuestions, extractAllTextualFragments } from './fragment.js';
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
export async function document_add(filepath) { 

    if (!(existsSync(filepath))){
        throw new Error("File not found at " + filepath)
    }

    let id
    let extension = filepath.split(".").at(-1)
    
    if (extension == 'html'){
        const thishtml = await gethtmlFromFile(filepath)
        id = await document_add_html(thishtml, filepath, "html")

    }else if (extension == "png" || extension == "jpg" || extension == "gif"){
        const thishtml = imageToHTML(filepath)
        id = await document_add_html(thishtml, filepath, "image")

    }else if (extension == "xlsx"){
        let surveyId = "SURVEY_ID" //need to get this from the user somehow
        const thishtml = excelSurveyToHTML(filepath, surveyId)
        id = await document_add_html(thishtml, filepath, "survey")

    }else if (extension == "txt"){
        let interviewID = "INTERVIEW_ID" //need to get this from the user somehow
        const thishtml = await transcriptToHTML(filepath, interviewID)
        id = await document_add_html(thishtml, filepath, "transcript")

    }else {
        const thisdata = await getBinaryFromFile(filepath)
        id = await document_add_data(thisdata, filepath, "unknown")
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
export async function document_add_autoFrag(filepath) { 

    if (!(existsSync(filepath))){
        throw new Error("File not found at " + filepath)
    }

    let extension = filepath.split(".").at(-1)

    let id = null
    let fragIds = []
    if (extension == 'html'){
        const thishtml = await gethtmlFromFile(filepath)
        id = await document_add_html(thishtml, filepath, "html")

        const frags = await extractAllTextualFragments(thishtml)
        console.log(frags)
        for (const frag of frags){
            const fragId = await fragment_add_html(frag, id, "Auto-extracted html fragment: " + filepath.split(sep), "html")
            fragIds.push(fragId)
        }

    }else if(extension=="png" || extension=="jpg" || extension=="gif"){
        //auto add entire image as a fragment
        const thishtml = imageToHTML(filepath)
        id = await document_add_html(thishtml, filepath, "image")

        const fragid = await fragment_add_html(null, id, "Whole image: " + filepath.split(sep), "image", null)
        fragIds.push(fragid)


    }else if(extension == "xlsx"){
        let surveyId = "SURVEY_ID" //need to get this from the user somehow
        const thishtml = excelSurveyToHTML(filepath, surveyId)
        id = await document_add_html(thishtml, filepath, "survey")

        const frags = await extractAllSurveyQuestions(thishtml)
        for (const frag of frags){
            const fragId = await fragment_add_html(frag, id, "Auto-extracted survey question: " + filepath.split(sep), "survey")
            fragIds.push(fragId)
        }
    

    }else if(extension == "txt"){
        let interviewID = "INTERVIEW_ID" //need to get this from the user somehow
        const thishtml = await transcriptToHTML(filepath, interviewID)
        id = await document_add_html(thishtml, filepath, "transcript")

        const frags = await extractAllInterviewDialogueSections(thishtml)
        for (const frag of frags){
            const fragId = await fragment_add_html(frag, id, "Auto-extracted transcript segment: " + filepath.split(sep), "transcript")
            fragIds.push(fragId)
        }
    
    }else{
        const thisdata = await getBinaryFromFile(filepath)
        id = await document_add_data(thisdata, filepath, "unknown")
        //add doc as its own fragment

        const fragId = await fragment_add_data(thisdata, id, "Auto-extracted data fragment: "  + filepath.split(sep), "unknown")
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
export async function fragments_search_by_linked_document(doc_id){
    const rawFragList = await crud_getAllFragments_fromSpecificDoc(doc_id)
    let htmlfragList = []
    let binaryfragList = []

    for (const frag of rawFragList){
        if (frag.html != null){
            htmlfragList.push(frag)
        }else{
            binaryfragList.push(frag)
        }
    }

    const fragments = {
        binaryDataFrags : binaryfragList,
        htmlfragList : htmlfragList
    }

    return fragments
}

//dont use this directly
async function document_add_data(data, filepath, type, tags=[]) { 

    const filename = filepath.split("/").at(-1)

    const newdoc = {
        name: filename,
        data: data,
        html: null,
        type: type,
        tags: tags
    }

    const id = await crud_addNewItem("documents",newdoc)

    return id
}

export async function document_add_html(html, filepath, type, tags=[]) {

    const filename = filepath.split("/").at(-1)

    const newdoc = {
        name: filename,
        data: null,
        html: html,
        type: type,
        tags: tags
    }

    const id = await crud_addNewItem("documents", newdoc)

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
export async function fragment_add_html(html, docid, fragName="testFragment", type, coords = null, tags=[]) {

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
        coords: coords,
        tags: tags
    }

    const id = await crud_addNewItem("fragments", newfrag)

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
export async function fragment_add_data(data, docid, fragName="testFragment", type, tags=[]) { 

    const newfrag = {
        name: fragName,
        docid: docid,
        html: null,
        data: data,
        type: type,
        tags: tags
    }

    const id = await crud_addNewItem("fragments", newfrag)

    return id
}


/**
 * Fetches a fragment from the fragments container using the fragmentID.
 * Returns the object
 *
 * @export
 * @param {ObjectId} id
 * @return {BinaryData|string} 
 */
export async function fragment_find(id) { 

    const newfrag = await crud_getItem("fragments", id)
    return newfrag
     
}

/**
 * Fetches a document from the documents container using the documentID.
 * Returns the object
 *
 * @export
 * @param {ObjectId} id
 * @return {object} 
 */
export async function document_find(id) { 

    const newDoc = await crud_getItem("documents", id)
    return newDoc
}

/**
 * Fetches a annotation from the annotations container using the annotationID.
 * Returns the object
 *
 * @export
 * @param {ObjectId} id
 * @return {object} 
 */
export async function annotation_find(id) { 

    const newDoc = await crud_getItem("annotations", id)
    return newDoc
}




/**
 * Deletes a document from the documents container using a documentID. Returns a DeleteResult for confirmation.
 * WILL ALSO DELETE ALL FRAGMENTS LINKED TO THE DOC.
 *
 * @export
 * @param {ObjectId} id
 * @return {DeleteResult} 
 */
export async function document_delete(id){return await crud_deleteDoc(id)}


/**
 * Deletes a fragment from the fragments container using a fragmentID. Returns a DeleteResult for confirmation.
 *
 * @export
 * @param {ObjectId} id
 * @return {DeleteResult} 
 */
export async function fragment_delete(id){return await crud_deleteFragment(id)}


/**
 * Searches through a registered html document for html sections with matching attributes. Returns a list of the tag sections that match
 *
 * @export
 * @param {ObjectId} docid
 * @param {String} attribute
 * @return {Array<String>} 
 */
export async function document_searchContentsFor_HTMLattribute(docid, attribute){

    let matches = []
    const doc = await document_find(docid)
    if (doc.html!=null){
        matches = await HTMLByAttribute(doc.html, attribute)
    }else{
        console.error("File has no HTML content: " + docid)
    }

    return matches

}

/**
 * Searches through a registered html document for html sections with matching attribute-value pairs. Returns a list of the tag sections that match
 *
 * @export
 * @param {ObjectId} docid
 * @param {String} attribute
 * @param {String} value
 * @return {Array<String>} 
 */
export async function document_searchContentsFor_HTMLattributeValue(docid, attribute, value){

    let matches = []
    const doc = await document_find(docid)

    if (doc.html!=null){
        matches = await HTMLByAttributeValue(doc, attribute, value)
    }else{
        console.error("File has no HTML content: " + docid)
    }

    return matches
    
}

/**
 *
 * Searches through a registered html document for html sections with matching tag-value pairs. Returns a list of the tag sections that match.
 * Provides the option to specify tag class, for greater refinement.
 * 
 * Leaving the value field null means all matching tags, regardless of tag-value will be returned.
 *
 * @export
 * @param {ObjectId} docid
 * @param {string} tag
 * @param {string} value
 * @param {string} [t_class=null]
 * @return {*} 
 */
export async function document_searchContentsFor_HTMLTagValue(docid, tag, value=null, t_class=null){
    let matches = []
    const doc = await document_find(docid)

    if (doc.html!=null){
        if (value != null){
            matches = await HTMLByTagValueContains(doc, tag, value, t_class)
        }else{
            matches = await HTMLByTag(doc,tag,t_class)
        }
    }else{
        console.error("File has no HTML content: " + docid)
    }

    return matches
}


/**
 * Adds a tag (string) to an existing document. Returns 0 if successful, -1 otherwise.
 *
 * @export
 * @param {ObjectId} docid
 * @param {string} tag
 * @return {number} 
 */
export async function document_addTag(docid, tag){const res = await crud_TagItem("documents", docid, tag); return res}


/**
 * Adds a tag (string) to an existing fragment. Returns 0 if successful, -1 otherwise.
 *
 * @export
 * @param {ObjectId} fragid
 * @param {string} tag
 * @return {number} 
 */
export async function fragment_addTag(fragid, tag){const res = await crud_TagItem("fragments", fragid, tag); return res}


/**
 * Adds a tag (string) to an existing annotation. Returns 0 if successful, -1 otherwise.
 *
 * @export
 * @param {ObjectId} fragid
 * @param {string} tag
 * @return {number} 
 */
export async function annotation_addTag(fragid, tag){const res = await crud_TagItem("annotations", fragid, tag); return res}


/**
 * Retrieves all documents tagged with AT LEAST ONE of the tags in tagList.
 *
 * @export
 * @param {Array<string>} tagList
 * @return {Array<object>} docs
 */
export async function document_searchByTagsList_OR(tagList){
    const docs = await crud_searchByTagListOR("documents", tagList)
    return docs
}

/**
 * Retrieves all documents tagged with ALL of the tags in tagList.
 *
 * @export
 * @param {Array<string>} tagList
 * @return {Array<object>} docs
 */
export async function documents_searchByTagsList_AND(tagList){
    const docs = await crud_searchByTagListAND("documents", tagList)
    return docs
}

/**
 * Retrieves all fragments tagged with AT LEAST ONE of the tags in tagList.
 *
 * @export
 * @param {Array<string>} tagList
 * @return {Array<object>} docs
 */
export async function fragment_searchByTagsList_OR(tagList){
    const frags = await crud_searchByTagListOR("fragments", tagList)
    return frags
}


/**
 * Retrieves all fragments tagged with ALL of the tags in tagList.
 *
 * @export
 * @param {Array<string>} tagList
 * @return {Array<object>} docs
 */
export async function fragment_searchByTagsList_AND(tagList){
    const frags = await crud_searchByTagListAND("fragments", tagList)
    return frags
}

/**
 * Retrieves all annotations tagged with AT LEAST ONE of the tags in tagList.
 *
 * @export
 * @param {Array<string>} tagList
 * @return {Array<object>} docs
 */
export async function annotation_searchByTagList_OR(tagList){
    const frags = await crud_searchByTagListOR("annotations", tagList)
    return frags
}


/**
 * Retrieves all annotations tagged with ALL of the tags in tagList.
 *
 * @export
 * @param {Array<string>} tagList
 * @return {Array<object>} docs
 */
export async function annotation_searchByTagList_AND(tagList){
    const frags = await crud_searchByTagListAND("annotations", tagList)
    return frags
}


/**
 *  Creates an annotation from html content and links it to the available fragments. Options for naming and tagging the annotation are included.
 * 
 *
 * @export
 * @param {string} htmlContent
 * @param {Array<ObjectId>} fragmentIDList
 * @param {Array<string>} [tags=[]]
 * @param {string} [annotationName="New annotation"]
 * @return {ObjectId} insertedID 
 */
export async function annotation_create(htmlContent, fragmentIDList, tags=[], annotationName="New annotation"){
    const newAnnot = {
        name: annotationName,
        content: htmlContent,
        linkedFragments: fragmentIDList,
        tags: tags,
    }

    const insertedId = await crud_addNewItem("annotations", newAnnot)
    return insertedId
}


/**
 *  Gets all the annotations linked to a specific fragment.
 *
 * @export
 * @param {ObjectId} fragmentID
 * @return {Array<object>} 
 */
export async function annotation_search_by_linked_fragmentID(fragmentID){
    const annotations = await crud_getAllAnnotations_fromSpecificFragment(fragmentID)
    return annotations
}


/**
 * Finds all HTML tags containing text and returns them, in a list of html tags
 *
 * @export
 * @param {string} html
 * @return {Array<string>} 
 */
export function HTML_2_Textual_Fragments(html){
    return extractAllTextualFragments(html)
}


/**
 * Searches html representations of the .xlsx survey format, returning all questions and response pairs, denoted by the .qna class.
 * Returns a list of html strings
 *
 * @export
 * @param {string} html
 * @return {Array<string>} 
 */
export function HTML_2_Dialogue_List(html){
    return extractAllInterviewDialogueSections(html)
}


/**
 * Searches html representations of the known .txt transcript otter.ai format, returning all dialogue sections as a list, as dented by the .dialogue class.
 *
 * @export
 * @param {string} html
 * @return {Array<string>} 
 */
export function HTML_2_QnA_List(html){
    return extractAllSurveyQuestions(html)
}



/**
 * Get HTML tags containing each answer to a specific survey question. Provide the document ID of the survey, and the name of the question you would like to query.
 * 
 *
 * @export
 * @param {ObjectId} doc_id
 * @param {string} questionName
 * @return {Array<string>} questionList [HTML String]
 */
export async function survey_AnswersToASpecificQuestion(doc_id, questionName){
    const doc = await document_find(doc_id)

    let questionList = []

    if (doc.type != "survey"){
        console.error("Wrong doc type! It must be a survey.")
    }else{
        const html = await doc.html

        const qnas = await HTMLByTagValueContains(html,"li",questionName,"qna" )

        for (const qna of qnas){
            const a = await HTMLByTag(qna, "p", "answer")
            questionList.push(a[0])
        }
        //console.log(qnas)

    }

    return questionList

}

/**
 * Get HTML tags containing each dialogue section from a specific speaker. Provide the document ID of the transcript, and the name of the speaker you would like to query.
 * 
 *
 * @export
 * @param {ObjectId} doc_id
 * @param {string} speakerName
 * @return {Array<string>} questionList [HTML String]
 */
export async function transcript_DialogueFromASpecificSpeaker(doc_id, speakerName){
    const doc = await document_find(doc_id)

    let dialogueList = []

    if (doc.type != "transcript"){
        console.error("Wrong doc type! It must be a transcript. : " + doc.type)
    }else{
        const html = await doc.html

        const sections = await HTMLByTagValueContains(html,"li",speakerName,"dialogue")

        for (const sect of sections){
            const dialogue = await HTMLByTag(sect, "p", "speech")
            dialogueList.push(dialogue[0])
        }
    }

    return dialogueList

}
