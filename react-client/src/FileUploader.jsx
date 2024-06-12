import React, { useState } from 'react';
import { document_add_html } from './api/react_api';
import { ObjectId } from 'bson';

function FileUploader(){

    const [file, setFile] = useState(null)
    const [htmlDisplay, setHtmlDisplay] = useState("")
    const [returnIdDisplay, setReturnIdDisplay] = useState("")

    async function onUpload(){
        const fr = new FileReader()
        fr.readAsText(file)

        fr.onload = async function (event) {
            setHtmlDisplay(event.target.result);
            const id = await document_add_html(event.target.result, file.name, "html")
            setReturnIdDisplay(id.toString())
        }

    }

    return(
        <>
            <input type="file" accept=".html" onChange={(e) => {setFile(e.target.files[0])}}/> 
            <button onClick={onUpload}>Upload</button>

            <p>Document ID: {returnIdDisplay}</p>
            <p>HTML Content: {htmlDisplay}</p>
            
        </>

    )


}

export default FileUploader
        