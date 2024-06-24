import { useState, useEffect, useRef } from 'react'

import { fragments_findAll } from "../api/react_api"
import ItemList from "./ItemList"
import { fragments } from '../state'
import { useAtom } from 'jotai'

function FragmentSelector({spawnFragment}){

    const fragListRef = useRef()

    const [fragmentList, setFragmentList] = useAtom(fragments)

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