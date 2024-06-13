import { forwardRef, useEffect, useImperativeHandle, useState } from "react"


const ItemList = forwardRef(({itemList, setItemList, onDoubleClick, name}, ref) => {

    useImperativeHandle(ref, () =>{
        return{
            addItem: addNewItem
        }
    })

    const [selectedIndex, setSelectedIndex] = useState(-1)

    /* useEffect(() => {
        setItemList([...itemList, "item1", "item2", "item3"])
    }, []) */

    function addNewItem(item){
        setItemList([...itemList, item])
    }

    //console.log(itemList)

    return(
        <>
            
            <h2>{name}</h2>
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
            : <i>No items in the list</i>}
        
        </>

    )
})

export default ItemList