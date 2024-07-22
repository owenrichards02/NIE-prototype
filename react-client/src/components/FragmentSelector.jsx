import { useState, useEffect, useRef } from 'react'

import { fragments_findAll } from "../api/react_api"
import ItemList from "./ItemList"
import { fragments, documents } from '../state'
import { useAtom } from 'jotai'
import { Button, Card, CardBody, Option, Select } from '@material-tailwind/react'
import FragListWithTicks from './FragListWithTicks'

function FragmentSelector({spawnFragment, f2lRef, bulkSpawn}){

    const fragListRef = useRef()

    const [fragmentList, setFragmentList] = useAtom(fragments)
    const [documentList] = useAtom(documents)
    const [docsWithFrags, setDocsWithFrags] = useState([])
    const [docIDStr, setDocIDStr] = useState("")
    const [subsetList, setSubsetList] = useState([])

    useEffect(() => {
        async function loadAllFrags(){
        const fragList = await fragments_findAll()
        //console.log("items: " + fragList.length)
        let newlist = []
        for (const doc of fragList){
            newlist.push(doc)
        }
        setSubsetList([...fragmentList, ...newlist])
        setFragmentList([...fragmentList, ...newlist])

        }

        loadAllFrags()

    }, [])

    //finds all documents that have a fragment, and adds them to the dropdown
    useEffect(() => {
        let docsWithFragsBuilder = []
        let foundIDList = []
        for (const frag of fragmentList){
            if (!foundIDList.includes(frag.docid.toString())){
                for (const doc of documentList){
                    if(doc._id.toString() == frag.docid.toString()){
                        docsWithFragsBuilder.push(doc)
                        foundIDList.push(doc._id.toString())
                    }
                }
            }  
        }
        setDocsWithFrags(docsWithFragsBuilder)
    }, [fragmentList, documentList])

    const onDoubleClick = (event) => {
        spawnFragment(event)
    }

    const addAll = (event) => {
        const idList = []
        for(const frag of subsetList){
            idList.push(frag._id)
        }
        bulkSpawn(idList)
    }
    
    const filterFrags = (docIDstr) => {
        if (docIDstr == ""){
            setSubsetList(fragmentList)
        }else{
            let newList = []
            for (const frag of fragmentList){
                if (frag.docid.toString() == docIDstr){
                    newList.push(frag)
                }
            }
            setSubsetList(newList)
        }
        
    }

    return (
        <>
        <div className='pick-frags'>
        <Card className="fragment-selector mt-0 w-600 text-black"><CardBody>
        <div className='component-block-vert-xsmall2'>
        <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Double click on a fragment to add it to the floor</h2>
        <Select size="md" label="Specify a document" 
        onChange={(val) => {
            filterFrags(val)
            setDocIDStr(val)
        }} value={docIDStr}>
        <Option value={""} key={"any"} className='text-left'>*ALL DOCUMENTS*</Option>
        {docsWithFrags.map((item, index) => (
            <Option value={item._id.toString()} key={item.name + index} className='text-left' >{item.name + " - " + item._id.toString()}</Option>
        ))}
        </Select>
        <FragListWithTicks itemList={subsetList}  setItemList={setFragmentList} onDoubleClick={onDoubleClick} ref={fragListRef} f2lRef={f2lRef} name="" ></FragListWithTicks>
        <Button onClick={addAll} className="">Add all fragments to the floor</Button>
        </div>
        </CardBody>
        </Card>
        </div>
        </>
    )

}

export default FragmentSelector