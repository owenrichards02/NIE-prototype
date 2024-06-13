import { useState, useEffect, useRef } from 'react'

import * as Realm from 'realm-web'
import { ObjectId } from 'bson';

import './App.css'
//import { document_add } from './api/react_api';
import FileUploader from './components/FileUploader';
import ItemList from './components/ItemList';
import HTMLViewer from './components/HTMLViewer';
import { document_find } from './api/react_api';

function App() {

  const docListRef = useRef()
  const message = "hi"
  const fp = "./resources/survey_example.xlsx"

  const [documentIDList, setDocumentIDList] = useState([]) 
  const [current_html, setCurrent_html] = useState("None Loaded") 


  async function changeHTMLView(newDocID){
      const o_id = new ObjectId(newDocID)
      const document = await document_find(o_id)
      console.log(document)
      const html = document.html
      setCurrent_html(html)
  }

  /* useEffect(() => {
    setDocumentIDList([...documentIDList, "itemFromApp"])
  }, []) */
  

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
      
      {/*<button onClick={() => {docListRef.current.addItem("Hello")}}></button> */}
      <div className='component-block'> 

        <div className='side-panel'>
          <ItemList itemList={documentIDList}  setItemList={setDocumentIDList} onDoubleClick={changeHTMLView} ref={docListRef} name="List of Documents" className="top-space"></ItemList>
          <FileUploader itemList={documentIDList} setItemList={setDocumentIDList}></FileUploader>
        </div>

        <HTMLViewer class="html-window" html={current_html}></HTMLViewer>        
      </div>
      
    </>
  )
}

export default App
