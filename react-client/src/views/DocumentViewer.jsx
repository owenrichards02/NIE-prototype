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

    const [documentID2NameList, setDocumentID2NameList] = useState([]) 
    const [documentList, setDocumentList] = useState([]) 
    const [current_html, setCurrent_html] = useState("None Loaded") 


    useEffect(() => {
        async function loadAllDocs(){
        const docList = await documents_findAll()
        console.log(docList.length)
        let newlistId = []
        let newlist = []
        for (const doc of docList){
            newlistId.push([doc._id.toString(), doc.name.toString()])
            newlist.push(doc)
        }
        setDocumentID2NameList([...documentID2NameList, ...newlistId])
        setDocumentList([...documentList, ...newlist])
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
          
          {/*<button onClick={() => {docListRef.current.addItem("Hello")}}></button> */}
          <div className='component-block'> 
    
            <div className='component-block-vert'>
            <ItemList itemList={documentID2NameList}  setItemList={setDocumentID2NameList} onDoubleClick={changeHTMLView} ref={docListRef} name="List of Documents"></ItemList>
            <FileUploader itemList={documentID2NameList} setItemList={setDocumentID2NameList}></FileUploader>
            </div>
              
              
            
            <HTMLViewer html={current_html}></HTMLViewer>        
          </div>
          
        </>
      )
    
  
    
}

export default DocumentViewer
    