import { useState, useEffect } from 'react'

import * as Realm from 'realm-web'
import { ObjectId } from 'bson';

import './App.css'
//import { document_add } from './api/react_api';
import FileUploader from './FileUploader';

function App() {

  const message = "hi"
  const fp = "./resources/survey_example.xlsx"

  

/*   const item = {
    html: "Test html",
    name: "filenameTest", 
    data: null,
    tags: ["hello", "there"]
  } */

  /* async function testAdd(){
    const id = await document_add(fp)
    console.log(id)
  } */
  
  //testAdd()

  return (
    <>
     
      <p className="test">
        {message}
      </p>


      <FileUploader></FileUploader>
    </>
  )
}

export default App
