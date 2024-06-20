import { forwardRef, useEffect, useImperativeHandle, useState } from "react"


const TextualList = ({itemList, onDoubleClick}) => {

    const [selectedIndex, setSelectedIndex] = useState(-1)

    /* useEffect(() => {
        setItemList([...itemList, "item1", "item2", "item3"])
    }, []) */

    //console.log(itemList)

    return(
        <>
            <div className='bottom-three'>
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Choose textual section</h2>
            {itemList.length > 0 ? 
                <ul className="list-group">
                    {itemList.map((item, index) => (
                        <li className={selectedIndex === index ? 'list-group-item active' : 'list-group-item'} 
                            onClick={() => {setSelectedIndex(index)}} 
                            onDoubleClick={() => {onDoubleClick(item)}}
                            key={item}>
                            {item}
                        </li>
                    ))}
                </ul>
            : <i>No textual elements found</i>}
            </div>
        
        </>

    )
}

export default TextualList