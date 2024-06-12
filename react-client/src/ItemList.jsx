import { useEffect, useState } from "react"


function ItemList(){

    const [itemList, setItemList] = useState([]) 
    const [selectedIndex, setSelectedIndex] = useState(-1)

    useEffect(() => {
        setItemList([...itemList, "item1", "item2", "item3"])
    }, [])


    console.log(itemList)

    return(
        <>
            <h1>Item List</h1>
            <ul className="list-group">
                {itemList.map((item, index) => (
                    <li className={selectedIndex === index ? 'list-group-item active' : 'list-group-item'} 
                        onClick={() => {setSelectedIndex(index)}} 
                        key={item}>

                        {item}
                    </li>
                ))}
            </ul>
        
        </>

    )
}

export default ItemList