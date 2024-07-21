import { useState, useEffect, useRef } from 'react'

import { fragments_findAll } from "../api/react_api"
import ItemList from "./ItemList"
import { fragments } from '../state'
import { useAtom } from 'jotai'
import { Card, CardBody } from '@material-tailwind/react'
import FragListWithTicks from './FragListWithTicks'

function FragmentSelector({spawnFragment, f2lRef}){

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

    const onDoubleClick = (event) => {
        spawnFragment(event)
    }

    return (
        <>
        <div className='pick-frags'>
        <Card className="fragment-selector mt-0 w-600 text-black"><CardBody>
        <FragListWithTicks itemList={fragmentList}  setItemList={setFragmentList} onDoubleClick={onDoubleClick} ref={fragListRef} f2lRef={f2lRef} name="Available Fragments"></FragListWithTicks>
        </CardBody>
        </Card>
        </div>
        </>
    )

}

export default FragmentSelector