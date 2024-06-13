import React, { forwardRef, useState } from 'react';
import { document_add_html } from '../api/react_api';
import { ObjectId } from 'bson';

const FileUploader = ({itemList, setItemList}) => {

    const [file, setFile] = useState(null)

    async function onUpload(){
        const fr = new FileReader()
        fr.readAsText(file)

        fr.onload = async function (event) {
            const id = await document_add_html(event.target.result, file.name, "html")
            console.log(id.toString())
            setItemList([...itemList, id.toString()])
        }

    }

    return(
        <>
            <h2>Upload HTML Documents</h2>
            <div className='bottom-three'>
                <input type="file" accept=".html" onChange={(e) => {setFile(e.target.files[0])}}/> 
                <button onClick={onUpload}>Upload</button>
            </div>
        </>

    )


}

export default FileUploader
        