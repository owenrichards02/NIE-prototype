import { useAtom } from "jotai";
import 'react-image-crop/dist/ReactCrop.css'
import { documents, fragments } from "../state"
import { useEffect, useRef, useState } from "react";
import ItemList from "../components/ItemList";

import ReactCrop from 'react-image-crop'
import { Button } from "@material-tailwind/react";
import FragmentCreator, { FragmentCreatorNoPrev } from "../components/FragmentCreator";

function FragmentImage(){

    const docListRef = useRef()
    const imgRef = useRef(null)
    const [fragmentList, setFragmentList] = useAtom(fragments)
    const [documentList, setDocumentList] = useAtom(documents)

    const [img_documentList, set_img_DocumentList] = useState([])
    const [selectedDoc, setSelectedDoc] = useState(null)
    const [imgSrc, setImgSrc] = useState('')
    const [newFrag, setNewFrag] = useState(null)

    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const [previewSrc, setPreviewSrc] = useState('')


    const selectDoc = (id) => {
        console.log(id)
        for (const doc of documentList){
            if(doc._id == id){
                setImgSrc(doc.html.split('\"')[1])
                setSelectedDoc(doc)
            }
        }
    }

    useEffect(() => {
        async function findImages(){
        let newlist = []
        for (const doc of documentList){
            if(doc.type == "image"){
                newlist.push(doc)
            }
        }
        set_img_DocumentList(newlist)
        }

        findImages()

    }, [documentList])     
    
    const useWholeImage = () => {

        //use whole image
    }

    function getCroppedImg(){
        const image = imgRef.current
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width * image.naturalWidth / 100;
        canvas.height = crop.height * image.naturalHeight / 100;
        const ctx = canvas.getContext("2d");
    
        ctx.drawImage(
          image,
          crop.x * image.width * scaleX / 100,
          crop.y * image.height * scaleY / 100,
          crop.width * image.width / 100 * scaleX,
          crop.height * image.height / 100 * scaleY,
          0,
          0,
          crop.width * image.naturalWidth / 100,
          crop.height * image.naturalHeight / 100
        );
    
        const newhtml = '<img src=\"' + canvas.toDataURL() + '\"/>'
        setPreviewSrc(canvas.toDataURL())
        const newF = {
            docid: selectedDoc._id,
            html: newhtml
        }
        setNewFrag(newF)
      }

    return(
        <>
        <div className="topleft">
        
            <ItemList itemList={img_documentList}  setItemList={set_img_DocumentList} onDoubleClick={selectDoc} ref={docListRef} name="Available Images"></ItemList>
            {imgSrc && ( 
            <div className="cropper">
                <div className="component-block-vert-xsmall">
                    <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Select Crop Area</h2>
                    <ReactCrop crop={crop} onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)} onComplete={(c) => {setCompletedCrop(c); getCroppedImg()}} >
                        <img src={imgSrc} ref={imgRef}/>
                    </ReactCrop>
                    <Button onClick={useWholeImage}>Use Whole Image</Button>
                </div>
            </div>
            )}

            <div className="imgpreview">
                <div className="component-block-vert-small">
                    <div className="component-block-vert-xsmall">

                    <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Fragment Preview</h2>
                    {previewSrc && (

                    <img src={previewSrc}></img>
                    )}
                    </div>
                    {newFrag != null && (
                    <FragmentCreatorNoPrev frag={newFrag}></FragmentCreatorNoPrev>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}

export default FragmentImage