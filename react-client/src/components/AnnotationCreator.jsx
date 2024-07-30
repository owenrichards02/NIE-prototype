import { Button, Card, CardBody, CardHeader, Input, Textarea } from "@material-tailwind/react"
import { useEffect, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful";
import { annotation_create, annotation_find, annotations_findAll } from "../api/react_api";
import { ObjectId } from 'bson';
import { useAtom } from "jotai";
import { annotations } from "../state";

function AnnotationCreator({selObjRef, f2lRef, onAnnotCreated}){

const [annotationList, setAnnotationList] = useAtom(annotations)
const [fragNamesList, setFragNamesList] = useState([])
const [text, setText] = useState("")
const [color, setColor] = useState("#aabbcc");
const [fragIdsList, setFragIdsList] = useState([])
const fIdRef = useRef()
fIdRef.current = fragIdsList

useEffect(() => {
    console.log("updating selected list in annot creator")
    console.log(selObjRef.current)
    let names = []
    let ids = []
    for (const selObj of selObjRef.current){
        for (const f2l of f2lRef.current){
            if (f2l.uuid == selObj.id){
                names.push(f2l.frag.name)
                ids.push(new ObjectId(f2l.frag._id))
            }
        }
    }

    setFragNamesList(names)
    setFragIdsList(ids)

}, [selObjRef.current])

async function createAnnotation(){
    console.log("ANNOTATION: " + text)

    //need to save annotation 
    let id = await annotation_create(text, fIdRef.current, color, [], "new annotation")
    
    let newAnnot = {
        _id: id,
        name: "new annotation",
        content: text,
        color: color,
        linkedFragments: fIdRef.current,
        tags: []
    }
    setAnnotationList((annotations) => [...annotations, newAnnot])
    
    onAnnotCreated(text, selObjRef.current, color, id)
}

const changeText = (event) =>{
    setText(event.target.value)
}


return(
    <>
    {fragNamesList.length > 0 ? 
    <div className="annotation-creator">
    <Card className="mt-0 w-600 text-black">
    <CardBody>
        <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Annotation Creator</h2>
        
        <div className="component-block-vert-xsmall">
        <b>Currently Selected</b>
        <div className="selected-view-vf">
            {fragNamesList.map((item, index) => (  
                <li key={index}>
                <small><b>{item}</b> <br></br></small> 
                </li>
            ))}
        </div>
        <br></br>
        <b>Create new annotation</b>
        <div className="component-block-annot">
        <Textarea rows="5" onChange={changeText} label="Annotation Text" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"></Textarea>
        <HexColorPicker color={color} onChange={setColor} />
        </div>
        <Button onClick={createAnnotation}>Create Annotation</Button>
    </div>
    </CardBody>
    </Card>
    </div>
    : <></>}
    
    </>
)

}

export default AnnotationCreator