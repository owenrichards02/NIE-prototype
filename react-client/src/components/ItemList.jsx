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
            <div className='bottom-three'>
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>{name}</h2>
            {itemList.length > 0 ? 
                <ul className="list-group">
                    {itemList.map((item, index) => (
                        <li className={selectedIndex === index ? 'list-group-item active' : 'list-group-item'} 
                            onClick={() => {setSelectedIndex(index)}} 
                            onDoubleClick={() => {onDoubleClick(item[0])}}
                            key={item[0]}>
                            <b>{item[1]}</b> <br/>
                            <b>ID: </b> {item[0]}
                        </li>
                    ))}
                </ul>
            : <i>No items in the list</i>}
            </div>
        
        </>

    )
})

export default ItemList