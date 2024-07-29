import { useAtom } from "jotai"
import { documents, fragments } from "../state"
import FragmentGrid from "../components/FragmentGrid"
import { useEffect, useState } from "react"
import { fragments_findAll } from "../api/react_api"
import { Option, Select } from '@material-tailwind/react';
import FragmentEditorPanel from "../components/FragmentEditorPanel"

function MyFragments(){

    const [fragmentList, setFragmentList] = useAtom(fragments)
    const [subsetList, setSubsetList] = useState([])
    const [docsWithFrags, setDocsWithFrags] = useState([])
    const [documentList] = useAtom(documents)
    const [docIDStr, setDocIDStr] = useState("")
    const [selectedFragment, setSelectedFragment] = useState(null)

    useEffect(() => {
        async function loadAllFrags(){
        const fragList = await fragments_findAll()
        //console.log("items: " + fragList.length)
        let newlist = []
        for (const doc of fragList){
            newlist.push(doc)
        }
        setSubsetList(newlist)
        setFragmentList(newlist)

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
    <h1 className="title-location-myfrag mb-4 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">My Fragments</h1>
    <div className="fragment-filter-location w-72 text-black pb-4 z-50">
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

    </div>

    <FragmentGrid subsetList={subsetList} selectedFragment={selectedFragment} setSelectedFragment={setSelectedFragment}></FragmentGrid>

    {selectedFragment != null ? <FragmentEditorPanel selectedFragment={selectedFragment}></FragmentEditorPanel> : <></>}
    
    
    </>
    )
}

export default MyFragments