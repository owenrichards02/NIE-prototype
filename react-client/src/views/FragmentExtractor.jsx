import { useEffect, useRef, useState } from "react";
import ItemList from "../components/ItemList"
import HTMLViewer from './../components/HTMLViewer';
import { document_find, documents_findAll } from "../api/react_api";
import { ObjectId } from "bson";
import { extractAllTextualFragments } from "../api/fragment";
import TextualList from "../components/TextualList";
import FragmentCreator from "../components/FragmentCreator";

function FragmentExtractor(){

    const feRef = useRef()

    const [documentList, setDocumentList] = useState([]) 
    const [textFragsList, setTextFragsList] = useState([])
    const [chosenDocId, setChosenDocID] = useState([])
    const [chosenFrag, setChosenFrag] = useState("None Loaded") 
    const [showFragCreator, setShowFragCreator] = useState(false)


    useEffect(() => {
        async function loadAllDocs(){
        const docList = await documents_findAll()

        let newlist = []
        for (const doc of docList){
            newlist.push(doc)
        }
        setDocumentList([...documentList, ...newlist])
        }

        loadAllDocs()

    }, [])

    async function changeHTMLView(docid){
        setChosenDocID(docid)
        const o_id = new ObjectId(docid)
        const document = await document_find(o_id)
        //console.log(document)
        const html = document.html
        const textFrags = await extractAllTextualFragments(html)

        setTextFragsList(textFrags)
    }

    async function chooseTextSection(text){
        setChosenFrag(text)
        setShowFragCreator(true)
    }

    return (
        <>
        <div className="component-block-vert">
            <div className='component-block'>
                <ItemList itemList={documentList}  setItemList={setDocumentList} onDoubleClick={changeHTMLView} ref={feRef} name="List of Documents"></ItemList>
                <TextualList itemList={textFragsList} setItemList={setTextFragsList} onDoubleClick={chooseTextSection}></TextualList>        
            </div>
            {showFragCreator ? <FragmentCreator docid={chosenDocId} html={chosenFrag}></FragmentCreator> : <></>}
            
        </div>
        </>
    )
}

export default FragmentExtractor