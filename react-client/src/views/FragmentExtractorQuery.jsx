import { useAtom } from "jotai"
import FragmentCreator from "../components/FragmentCreator"
import ItemList from "../components/ItemList"
import TextualList from "../components/TextualList"
import { documents } from "../state"
import { useRef, useState } from "react"
import SelectMutlipleDocs from "../components/SelectMultipleDocs"
import QueryOptions from "../components/QueryOptions"

function FragmentExtractorQuery(){
    const feRef = useRef()

    const [documentList, setDocumentList] = useAtom(documents)

    const [selectedList, setSelectedList] = useState([])

    return(
        <>
        <div className="component-block-vert">
            <div className="component-block">
                <div className='component-block-vert-small'>
                    <SelectMutlipleDocs selectedList={selectedList} setSelectedList={setSelectedList}></SelectMutlipleDocs>
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


            <div className="component-block">
            <QueryOptions></QueryOptions>
            </div>



        </div>
       
        </>
    )
}

export default FragmentExtractorQuery