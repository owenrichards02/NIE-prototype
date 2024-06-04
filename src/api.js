import { crud_addNewDocument, crud_addNewFragment, crud_deleteDoc, crud_deleteFragment, crud_getAllFragments, crud_getDocument, crud_getFragment} from './CRUD.js';

import { JSDOM } from 'jsdom';

import { gethtmlFromFile, getBinaryFromFile, writehtmlBacktoFile } from "./fileTools.js"
import { extractFragments } from './fragment.js';
import { ObjectId } from 'bson';

/**
 * Stores a document in the documents container.
 * Returns the id mongodb assigned to the document.
 * Keeps HTML native, stores other file types as binary
 *
 * @export
 * @param {string} filepath
 * @return {ObjectId} id
 */
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


/**
 * Functionality of docAdd with automatic fragment extraction/storage
 * Auto adds extracted fragments if the doc is html, and the doc as its own fragment otherwise.
 * Returns the id mongodb assigned to the document with a list of fragment ids
 * @export
 * @param {string} filepath
 * @return {Array.<ObjectId|Array.<ObjectId>>} 
 */
export async function docAdd_autoFrag(filepath) { 
    let id = null
    let fragIds = []
    if (filepath.split(".").at(-1) == 'html'){
        const thishtml = await gethtmlFromFile(filepath)
        id = await docAdd_html(thishtml, filepath)

        const frags = await extractFragments(thishtml)
        console.log(frags)
        for (const frag of frags){
            const fragId = await fragmentAdd_html(frag, id, "Auto-extracted fragment")
            fragIds.push(fragId)
        }

    }else{
        const thisdata = await getBinaryFromFile(filepath)
        id = await docAdd_data(thisdata, filepath)
        //add doc as its own fragment

        const fragId = await fragmentAdd_data(thisdata, id, "Auto-extracted fragment")
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