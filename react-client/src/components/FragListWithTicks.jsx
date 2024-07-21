import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"


const FragListWithTicks = forwardRef(({itemList, setItemList, onDoubleClick, name, f2lRef}, ref) => {

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

    function isAdded(id){
        for (const f2l of f2lRef.current){
            if(f2l.frag._id == id){
                return true
            }
        }
        return false
    }

    return(
        <>
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>{name}</h2>
            {itemList.length > 0 ? 
                <ul className="list-group">
                    {itemList.map((item, index) => (
                        
                        <li className={selectedIndex === index ? 'list-group-item active' : 'list-group-item'} 
                            onClick={() => {setSelectedIndex(index)}} 
                            onDoubleClick={() => {onDoubleClick(item._id)}}
                            key={item._id.toString() + '_' + index.toString()}>
                            <div className="component-block-annot">
                                <div className="w-100 text-left">
                                    <b>{item.name}</b> <br/>
                                    <small><b>ID: </b> {item._id.toString()}</small> <br/>
                                    {'type' in item ? <small><b>Type: </b>{item.type}</small>: <></>}
                                </div>
                                {isAdded(item._id) ? <CheckCircleIcon className="w-6 fill-green-500"></CheckCircleIcon> : <></>}
                            </div>
                        </li>
                      
                    ))}
                    
                </ul>
            : <i>No items in the list</i>}
        
        </>

    )
})

export default FragListWithTicks