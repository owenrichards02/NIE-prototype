import { useState, useEffect, useRef } from 'react'

import { fragments_findAll } from "../api/react_api"
import ItemList from "./ItemList"

function FragmentSelector({spawnFragment, fragmentList, setFragmentList}){

    const fragListRef = useRef()

    useEffect(() => {
        async function loadAllFrags(){
        const fragList = await fragments_findAll()
        //console.log("items: " + fragList.length)
        let newlist = []
        for (const doc of fragList){
            newlist.push(doc)
        }
        setFragmentList([...fragmentList, ...newlist])
        }

        loadAllFrags()

    }, [])

    return (
        <>
        <div className='pick-frags'>
        <ItemList itemList={fragmentList}  setItemList={setFragmentList} onDoubleClick={spawnFragment} ref={fragListRef} name="Available Fragments"></ItemList>
        </div>
        </>
    )

}

export default FragmentSelector