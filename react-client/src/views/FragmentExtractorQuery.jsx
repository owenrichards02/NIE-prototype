import { useAtom } from "jotai"
import FragmentCreator from "../components/FragmentCreator"
import ItemList from "../components/ItemList"
import TextualList from "../components/TextualList"
import { documents } from "../state"
import { useRef, useState } from "react"
import SelectMutlipleDocs from "../components/SelectMultipleDocs"
import QueryOptions from "../components/QueryOptions"
import { Card, CardBody, CardHeader } from "@material-tailwind/react"

function FragmentExtractorQuery(){
    const feRef = useRef()

    const [documentList, setDocumentList] = useAtom(documents)

    const [selectedList, setSelectedList] = useState([])

    const [searchResults, setSearchResults] = useState([])
    const [chosenFrag, setChosenFrag] = useState("")

    const [rightSideHidden, setRightSideHidden] = useState(false)


    const newFragChosen = (frag) => {
        setChosenFrag(frag)
        console.log(frag)
    }

    const addAll = () =>{

    }

    return(
        <>
        
        <div className="component-block-vert">
            <div className="component-block">
                
                
                <div className='component-block-vert-small'>
                    <SelectMutlipleDocs selectedList={selectedList} setSelectedList={setSelectedList} setRightSideHidden={setRightSideHidden}></SelectMutlipleDocs>
                </div>

                <div className="selected-view">
                    <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Currently Selected</h2>
                    {selectedList.map((item, index) => (  
                        <li key={index}>
                        <b>{item.name}</b> <br></br>
                        <small><b>ID: </b> {item._id.toString()}</small> 
                        </li>
                    ))}
                </div>
               
                
            </div>
            {selectedList.length > 0 ?  <div className="component-block-vert-small">
            <QueryOptions selectedDocs={selectedList} setSearchResults={setSearchResults} setRightSideHidden={setRightSideHidden}></QueryOptions>
            </div> : <></>}
           



        </div>
        {searchResults.length > 0 && !rightSideHidden ? <div className="results-and-create">
        <div className="bottom-onefive">
        <Card>
        <CardBody>
        <TextualList itemList={searchResults} onDoubleClick={newFragChosen}></TextualList>
        
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={addAll}>Add all</button> 
      
        </CardBody>
        </Card>
        </div>
        {chosenFrag != "" ?
        <Card>
        <CardBody>
        <FragmentCreator frag={chosenFrag} ></FragmentCreator>
        </CardBody>
        </Card> : <></> }
        {
        //Need to figure out how to include the docid
        }
        
        </div> : <></>}
        
       
        </>
    )
}

export default FragmentExtractorQuery