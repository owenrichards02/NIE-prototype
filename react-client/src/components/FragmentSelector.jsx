import { useState, useEffect, useRef } from 'react'

import { fragments_findAll } from "../api/react_api"
import ItemList from "./ItemList"
import { fragments } from '../state'
import { useAtom } from 'jotai'
import { Button, Card, CardBody } from '@material-tailwind/react'
import FragListWithTicks from './FragListWithTicks'

function FragmentSelector({spawnFragment, f2lRef, bulkSpawn}){

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

    const addAll = (event) => {
        const idList = []
        for(const frag of fragmentList){
            idList.push(frag._id)
        }
        bulkSpawn(idList)
    }

    return (
        <>
        <div className='pick-frags'>
        <Card className="fragment-selector mt-0 w-600 text-black"><CardBody>
        <div className='component-block-vert-xsmall'>
        <FragListWithTicks itemList={fragmentList}  setItemList={setFragmentList} onDoubleClick={onDoubleClick} ref={fragListRef} f2lRef={f2lRef} name="Available Fragments"></FragListWithTicks>
        <Button onClick={addAll} className=''>Add all fragments to the floor</Button>
        </div>
        </CardBody>
        </Card>
        </div>
        </>
    )

}

export default FragmentSelector