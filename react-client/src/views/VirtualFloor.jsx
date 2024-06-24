import { useState } from 'react'
import FloorCanvas from '../components/FloorCanvas'
import FragmentSelector from '../components/FragmentSelector'
import { useAtom } from 'jotai'
import { fragments } from '../state'

function VirtualFloor(){
    //canvas on the left
    //toolbar on the right
        //fragment selector
        //annotation creation
        //save & load canvas
    const [fragmentInUseList, setFragmentInUseList] = useState([]) 
    const [fragmentList, setFragmentList] = useAtom(fragments) 

    function spawnFragment(fragid){
        for (const frag of fragmentList){
            if (frag._id == fragid){
                setFragmentInUseList([...fragmentInUseList, frag])  
                console.log("VF: adding fragment id: " + frag._id.toString())   
                console.log(fragmentInUseList) 
            }
        }
    }

    return(
        <>
        <div className='component-block'>
            <div className='component-block-vert'>
                <h1 className='vf-title'>Virtual Floor</h1>
                <FloorCanvas fragmentInUseList={fragmentInUseList} setFragmentInUseList={setFragmentInUseList}></FloorCanvas>
            </div>
            <div className='component-block-vert'>
                <FragmentSelector fragmentList={fragmentList} setFragmentList={setFragmentList} spawnFragment={spawnFragment}></FragmentSelector>
            </div>

        </div>
        </>
    )

}

export default VirtualFloor