import { useEffect, useState } from 'react'
import FragmentSelector from '../components/FragmentSelector'
import { useAtom } from 'jotai'
import { fragments } from '../state'

import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import parse from 'html-react-parser';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'

function VirtualFloor(){

    const x_canvasSize = 1300
    const y_canvasSize = 1100

    //canvas on the left
    //toolbar on the right
        //fragment selector
        //annotation creation
        //save & load canvas
    const [fragmentInUseList, setFragmentInUseList] = useState([]) 
    const [fragmentList, setFragmentList] = useAtom(fragments) 

    const { editor, onReady } = useFabricJSEditor()
    

    function spawnFragment(fragid){
        for (const frag of fragmentList){
            if (frag._id == fragid){
                setFragmentInUseList([...fragmentInUseList, frag])  
                console.log("VF: adding fragment id: " + frag._id.toString())   
                console.log(fragmentInUseList) 

                //if image!
                if (frag.type == "image"){
                    fabric.Image.fromURL(frag.html.split('\"')[1], function (oImg) {
                        oImg.getScaledHeight() >= oImg.getScaledWidth() ? oImg.scaleToHeight(200) : oImg.scaleToWidth(200)
                        editor?.canvas.add(oImg);
                    });
                }else{

                    const doc = new DOMParser().parseFromString(frag.html, 'text/html');
                    const xhtml = new XMLSerializer().serializeToString(doc);
                    let svg = '<svg xmlns="http://www.w3.org/2000/svg" display="block"><foreignObject width="200" height="200"><div xmlns="http://www.w3.org/1999/xhtml">'
                    svg += xhtml
                    svg += '</div></foreignObject></svg>'
                
                    fabric.Image.fromURL('data:image/svg+xml,' + encodeURIComponent(svg), function (oImg) {
                        oImg.getScaledHeight() >= oImg.getScaledWidth() ? oImg.scaleToHeight(200) : oImg.scaleToWidth(200)
                        editor?.canvas.add(oImg);
                    });
                }
            }
        }
    }

    useEffect(() => {
        editor?.canvas.setWidth(x_canvasSize)
        editor?.canvas.setHeight(y_canvasSize) 
    });

    return(
        <>
        <div id="hi" className='component-block'>
            <div className='component-block-vert'>
                <h1 className='vf-title'>Virtual Floor</h1>
                <FabricJSCanvas className="floorcanvas" onReady={onReady} style={{width : x_canvasSize.toString() + "px", height : y_canvasSize.toString() + "px"}} />
            </div>
            <div className='component-block-vert'>
                <FragmentSelector fragmentList={fragmentList} setFragmentList={setFragmentList} spawnFragment={spawnFragment}></FragmentSelector>
            </div>

        </div>
        </>
    )

}

export default VirtualFloor