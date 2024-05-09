import { readFileSync } from 'fs';

import { config } from 'dotenv';
config()

import { addNewDocument, getDocument } from './CRUD.js';

import { Binary } from "bson";


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
async function testDocFileRetrieve(id) { 

    const newDoc = await getDocument(id)
    const bin_data = newDoc.data
    
    return bin_data
}


const filepath = "./test_img.jpg"
const id = await testDocFileAdd(filepath)

//console.log("ID:", id)

const bin_data = await testDocFileRetrieve(id)
console.log("DATA:", (bin_data))