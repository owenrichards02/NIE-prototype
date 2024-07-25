import { useAtom } from "jotai"
import { fragments } from "../state"
import FragmentGrid from "../components/FragmentGrid"
import { useEffect, useState } from "react"
import { fragments_findAll } from "../api/react_api"

function MyFragments(){

    const [fragmentList, setFragmentList] = useAtom(fragments)
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

    return (
    <>
    <h1 className="title-location-myfrag mb-4 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">My Fragments</h1>
    
    <FragmentGrid subsetList={subsetList} setSubsetList={setSubsetList}></FragmentGrid>
    </>
    )
}

export default MyFragments