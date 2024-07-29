import React, { forwardRef, useState, useSyncExternalStore } from 'react';
import { document_add_html, document_find } from '../api/react_api';
import { ObjectId } from 'bson';
import { useAtom, useSetAtom } from 'jotai';
import { documents } from '../state';
import { Card, CardBody, Input, Option, Select } from '@material-tailwind/react';

const FileUploader = ({itemList, setItemList}) => {

    const [file, setFile] = useState(null)
    const [type, setType] = useState("")

    const setDocuments = useSetAtom(documents)

    async function onUpload(){
        const fr = new FileReader()
        fr.readAsText(file)

        fr.onload = async function (event) {
            const id = await document_add_html(event.target.result, file.name, type)
            console.log(id.toString())
            const newItem = {
                _id: id,
                name: file.name,
                type: type
            }
            setItemList([...itemList, newItem])

            const doc = await document_find(id)
            setDocuments((documents) => [...documents, doc])
        }

    }

    return(
        <>
            <Card className='w-[560px]'>
                <CardBody>
                <div className='file-uploader'>
                <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Upload HTML Documents</h2>

                <Input size="lg" className="" type="file" accept=".html" onChange={(e) => {setFile(e.target.files[0])}}/> 
                <div className='component-block-xshort'>
                    <Select size="lg" label="Select Type" value={type}
                        onChange={(val) => setType(val)}>
                        <Option value="html">html</Option>
                        <Option value="image">image</Option>
                    </Select>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onUpload}>Upload</button>
                </div>
               
            </div>
                </CardBody>
            </Card>
            
        </>

    )


}

export default FileUploader
        