import { useRef, useState } from "react";
import { document_find, fragment_add_html } from "../api/react_api";
import DOMPurify from "dompurify";
import { Input, Option, Select } from "@material-tailwind/react";

function FragmentCreator({frag}){

    const nameRef = useRef()
    const [newFragName, setNewFragName] = useState("Unnamed Fragment") 

    const handleNameChange = (event) =>{
        setNewFragName(event.target.value)
    }

    const handleSubmit = (event) => {
        async function hSubmit(){
            const doc = await document_find(frag.docid)

            //need system for images
            //need system for tags
            const id = await fragment_add_html(frag.html, frag.docid, newFragName, doc.type, null, [])
            console.log(id)

            //NEED TO UPDATE FRAGMENTS ATOM
        }

        hSubmit()
        
    };



    return(
        <>
        <div className="component-block-short">
            <div className="component-block-vert-small">
                <div className="w-72">
                <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Create new fragment</h2>
                <Input type="text" onChange={handleNameChange} label="Fragment Name" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> <br></br>
                <Select label="Select Tags">
                    <Option>Test</Option>
                </Select>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Create</button>
            </div>
            <div className="component-block-vert-xsmall">
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Fragment Preview</h2>
            { <div className="html-content-view" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(frag.html) }} /> }
            </div>
            
        </div>
        
        </>
    )

}

export function FragmentCreatorNoPrev({frag}){
    const nameRef = useRef()
    const [newFragName, setNewFragName] = useState("Unnamed Fragment") 

    const handleNameChange = (event) =>{
        setNewFragName(event.target.value)
    }

    const handleSubmit = (event) => {
        async function hSubmit(){
            console.log(frag.html)
            const doc = await document_find(frag.docid)

            //need system for images
            //need system for tags
            const id = await fragment_add_html(frag.html, frag.docid, newFragName, doc.type, null, [])
            console.log(id)

            //NEED TO UPDATE FRAGMENTS ATOM
        }

        hSubmit()
        
    };



    return(
        <>
        <div className="component-block-vert-small">
            <div className="w-72">
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Create new fragment</h2>
            <Input type="text" onChange={handleNameChange} label="Fragment Name" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> <br></br>
            <Select label="Select Tags">
                <Option>Test</Option>
            </Select>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Create</button>
        </div>
            
        </>
    )

}

export default FragmentCreator