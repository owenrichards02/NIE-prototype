import { useEffect, useRef, useState } from "react";
import ItemList from "../components/ItemList"
import HTMLViewer from '../components/HTMLViewer';
import { document_find, documents_findAll } from "../api/react_api";
import { ObjectId } from "bson";
import { extractAllTextualFragments } from "../api/fragment";
import TextualList from "../components/TextualList";
import FragmentCreator from "../components/FragmentCreator";
import { useAtom } from "jotai";
import { documents } from "../state";
import { Card, CardBody, Input } from "@material-tailwind/react";

function FragmentExtractorTextual(){

    const feRef = useRef()

    const [documentList, setDocumentList] = useAtom(documents) 

    const [textFragsList, setTextFragsList] = useState([])
    const [chosenDocId, setChosenDocID] = useState(null)
    const [chosenFrag, setChosenFrag] = useState("None Loaded") 
    const [showFragCreator, setShowFragCreator] = useState(false)

    async function changeHTMLView(docid){
        setChosenDocID(docid)
        const o_id = new ObjectId(docid)
        const document = await document_find(o_id)
        //console.log(document)
        const html = document.html
        const textFrags = await extractAllTextualFragments(html)

        let textFragsObjs = []
        for (const tf of textFrags){
            const obj = {
                docid: o_id,
                html: tf
            }
            textFragsObjs.push(obj)
        }

        setTextFragsList(textFragsObjs)
    }

    async function chooseTextSection(frag){
        setChosenFrag(frag)
        setShowFragCreator(true)
    }

    return (
        <>
        <div className="component-block-vert">
            <div className="selector-textual-position">
                <div className='component-block'>
                    <div className="doc-selector-width">
                        <Card className="doc-selector-card">
                        <CardBody>
                        <ItemList itemList={documentList}  setItemList={setDocumentList} onDoubleClick={changeHTMLView} ref={feRef} name="Select document"></ItemList>
                        </CardBody>
                        </Card>
                    </div>
                    <div className="textual-selector-width">
                        <Card className="textual-selector-card">
                        <CardBody>
                        <TextualList itemList={textFragsList} setItemList={setTextFragsList} onDoubleClick={chooseTextSection}></TextualList>  
                        </CardBody>
                        </Card>
                    </div>
                    
                </div>
            </div>
            <div className="frag-creator-location-textual">
            {showFragCreator ?
            <Card className="frag-creator-card-textual">
            <CardBody>
             <FragmentCreator frag={chosenFrag}></FragmentCreator> 
            </CardBody>
            </Card>
            : <></>}
            </div>
            
        </div>
        </>
    )
}

export default FragmentExtractorTextual