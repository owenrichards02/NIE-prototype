import { useAtom } from "jotai"
import { documents } from "../state"
import { useState } from "react"

function SelectMutlipleDocs({selectedList, setSelectedList, setRightSideHidden}){

    const [documentList, setDocumentList] = useAtom(documents)

    const handleOnChange = (changeitem) => {
        //remove or add
        selectedList.includes(changeitem) ? setSelectedList(selectedList.filter((item, index) => item !== changeitem)) : setSelectedList([...selectedList, changeitem])
        setRightSideHidden(true)
    }

    return(
        <>
        <div className="document-select-multiple">
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Select documents to query</h2>
            <ul className="scrollable-selector">
                {documentList.map((item, index) => (
                    <label key={index + item.name}>
                    <li className="list-group-item">
                    <input type="checkbox" name={item.name} onChange={() => handleOnChange(item)}></input><b> {item.name}</b> <br/>
                    <small><b>ID: </b> {item._id.toString()}</small> <br/>
                    </li>
                    </label>
                ))}
            </ul>
        </div>
        
        </>
    )
}

export default SelectMutlipleDocs