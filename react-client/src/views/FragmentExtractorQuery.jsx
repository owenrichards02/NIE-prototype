import { useAtom } from "jotai"
import FragmentCreator from "../components/FragmentCreator"
import ItemList from "../components/ItemList"
import TextualList from "../components/TextualList"
import { documents } from "../state"
import { useRef, useState } from "react"

function FragmentExtractorQuery(){
    const feRef = useRef()

    const [documentList, setDocumentList] = useAtom(documents)

    const [textFragsList, setTextFragsList] = useState([])
    const [chosenDocIds, setChosenDocIDs] = useState([])
    const [chosenFrag, setChosenFrag] = useState("None Loaded") 
    const [showFragCreator, setShowFragCreator] = useState(false)

    function docChosen(docid){
        setChosenDocIDs([...chosenDocIds, docid])
    }

    return(
        <>
        <div className="component-block-vert">
            <div className='component-block'>
                <ItemList itemList={documentList}  setItemList={setDocumentList} onDoubleClick={docChosen} ref={feRef} name="Select document"></ItemList>     
            </div>
            
        </div>
        </>
    )
}

export default FragmentExtractorQuery