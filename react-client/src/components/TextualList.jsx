import { Input } from "@material-tailwind/react"
import { useEffect, useState } from "react"


const TextualList = ({itemList, onDoubleClick}) => {

    const [selectedIndex, setSelectedIndex] = useState(-1)

    const [listSubset, setListSubset] = useState([])
    
    const searchChanged = (event) => {
        const searchTerm = event.target.value
        
        if (searchTerm == ""){
            setListSubset(itemList)
        }else{
            let newList = []
            for (const item of itemList){
                if (item.html.includes(searchTerm)){
                    newList.push(item)
                }
            }
            setListSubset(newList)
        }
    }

    useEffect(() => {
        setListSubset(itemList)
    }, [itemList])

    return(
        <>
            <div className='bottom-one'>
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Choose textual section</h2>
            <Input label="Search for text content" icon={<i className="fas fa-heart" />}  onChange={searchChanged}/>

            {itemList.length > 0 ? 
                <ul className="list-group">
                    {listSubset.length > 0 ?
                    <div>
                    {listSubset.map((item, index) => (
                        <li className={selectedIndex === index ? 'list-group-item active' : 'list-group-item'} 
                            onClick={() => {setSelectedIndex(index)}} 
                            onDoubleClick={() => {onDoubleClick(item)}}
                            key={item.html + '_' + index}>
                            {item.html}
                        </li>
                    ))}
                    </div>
                    : <i>No results found</i> }
                </ul>
            : <i>No textual elements found</i>}
            </div>
        
        </>

    )
}

export default TextualList