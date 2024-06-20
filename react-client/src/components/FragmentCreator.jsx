import { useRef, useState } from "react";
import { document_find, fragment_add_html } from "../api/react_api";
import DOMPurify from "dompurify";
import { Input } from "@material-tailwind/react";

function FragmentCreator({docid, html}){

    const nameRef = useRef()
    const [newFragName, setNewFragName] = useState("Unnamed Fragment") 

    const handleNameChange = (event) =>{
        setNewFragName(event.target.value)
    }

    const handleSubmit = (event) => {
        async function hSubmit(){
            const doc = await document_find(docid)

            //need system for images
            //need system for tags
            const id = await fragment_add_html(html, docid, newFragName, doc.type, null, [])
            console.log(id)
        }

        hSubmit()
        
    };

    return(
        <>
        <div className="component-block">
            <div className="component-block-vert">
                <div className="w-72">
                <Input type="text" onChange={handleNameChange} label="Fragment Name" className="w-72" />
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Create Fragment</button>
                <br></br>
            </div>
            <div className="component-block-vert">
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Fragment Preview</h2>
            { <div className="html-content-view" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} /> }
            </div>
            
        </div>
        
        </>
    )

}

export default FragmentCreator