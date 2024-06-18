import { useState } from 'react'
import FloorCanvas from '../components/FloorCanvas'

function VirtualFloor(){
    //canvas on the left
    //toolbar on the right
        //fragment selector
        //annotation creation
        //save & load canvas

    return(
        <>
        <div className='component-block'>
            <div className='component-block-vert'>
                <h1 className='vf-title'>Virtual Floor</h1>
                <FloorCanvas></FloorCanvas>
            </div>
            <div className='component-block-vert'>
                
            </div>

        </div>
        </>
    )

}

export default VirtualFloor