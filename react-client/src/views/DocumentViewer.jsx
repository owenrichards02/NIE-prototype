import { useState, useEffect, useRef } from 'react'

import { ObjectId } from 'bson';

import '../App.css'
//import { document_add } from './api/react_api';
import FileUploader from '../components/FileUploader';
import ItemList from '../components/ItemList';
import HTMLViewer from '../components/HTMLViewer';
import { document_find, documents_findAll } from '../api/react_api';

function DocumentViewer(){

    const docListRef = useRef()

    const [documentList, setDocumentList] = useState([]) 
    const [current_html, setCurrent_html] = useState("None Loaded") 


    useEffect(() => {
        async function loadAllDocs(){
        const docList = await documents_findAll()

        let newlist = []
        for (const doc of docList){
            newlist.push(doc)
        }
        setDocumentList(newlist)
        }

        loadAllDocs()

    }, [])
    

    async function changeHTMLView(newDocID){
        const o_id = new ObjectId(newDocID)
        const document = await document_find(o_id)
        //console.log(document)
        const html = document.html
        setCurrent_html(html)
    }




    return (
        <>

        <div className='docviewer'>
          
          {/*<button onClick={() => {docListRef.current.addItem("Hello")}}></button> */}
          <div className='component-block'> 
    
            <div className='component-block-vert '>
            <ItemList itemList={documentList}  setItemList={setDocumentList} onDoubleClick={changeHTMLView} ref={docListRef} name="List of Documents"></ItemList>
            <FileUploader itemList={documentList} setItemList={setDocumentList}></FileUploader>
            </div>
            
            <HTMLViewer html={current_html}></HTMLViewer>     
               
          </div>

          </div>
          
        </>
      )
    
  
    
}

export default DocumentViewer
    