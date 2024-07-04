import { useEffect, useState } from 'react'
import FragmentSelector from '../components/FragmentSelector'
import { useAtom, atom } from 'jotai'
import { RESET, atomWithStorage } from 'jotai/utils'
import { fragments } from '../state'

import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import parse from 'html-react-parser';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'

const f2c_atom = atomWithStorage('frag2canvas2', [])

function VirtualFloor(){

    const x_canvasSize = 1300
    const y_canvasSize = 1100

    //canvas on the left
    //toolbar on the right
        //fragment selector
        //annotation creation
        //save & load canvas
    
    const [fragmentList, setFragmentList] = useAtom(fragments) 
    const [frag2LocationList, setfrag2LocationList] = useAtom(f2c_atom) //objects {frag: frag, canvasObj: canvasObj}
    
    const [loaded, setLoaded] = useState(false)
    const [isReady, setisReady] = useState(false)

    const { editor, onReady } = useFabricJSEditor()

    useEffect(() => {
        //setfrag2LocationList(RESET) //delete to enable storage
        editor?.canvas.on('object:modified', modifiedHandler)
        editor?.canvas.setWidth(x_canvasSize)
        editor?.canvas.setHeight(y_canvasSize) 
    }, );

    useEffect(() => {
        if(fragmentList.length > 0 && frag2LocationList.length > 0){
            setisReady(true)
        }
        
    }, [fragmentList])

    useEffect(() => {
        if(isReady && loaded == false){
            setLoaded(true)
            load()
        }else{      
            console.log("storage not yet loaded")
        }
    }, [isReady])

    function load(){
        
        console.log("loading from storage, " + frag2LocationList.length)
        const toLoad = []
        for (const f2cObj of frag2LocationList){
            toLoad.push(f2cObj)
        }

        for(const f2co of toLoad){
            spawnFromLoad(f2co)
        }
    }

    function spawnFromLoad(frag2Location){
        const frag = frag2Location.frag
        const locObj = frag2Location.locationObj
        const uuid = crypto.randomUUID()

            //if image!
            if (frag.type == "image"){
                fabric.Image.fromURL(frag.html.split('\"')[1], function (oImg) {
                    doSpawnLoad(oImg, frag, locObj, uuid)
                }, {id: uuid});
            }else{

                const doc = new DOMParser().parseFromString(frag.html, 'text/html');
                const xhtml = new XMLSerializer().serializeToString(doc);
                let svg = '<svg xmlns="http://www.w3.org/2000/svg" display="block"><foreignObject width="200" height="200"><div xmlns="http://www.w3.org/1999/xhtml">'
                svg += xhtml
                svg += '</div></foreignObject></svg>'
            
                fabric.Image.fromURL('data:image/svg+xml,' + encodeURIComponent(svg), function (oImg) {
                    doSpawnLoad(oImg, frag, locObj, uuid)
                }, {id: uuid});
            }

        function doSpawnLoad(oImg, frag, locObj, uuid){
            console.log("adding from load")
            
            oImg.scaleToHeight(locObj.height)
            oImg.scaleToWidth(locObj.width)
            const i = frag2LocationList.indexOf(frag2Location)
            const newList = [
                ...frag2LocationList.slice(0, i),
                ...frag2LocationList.slice(i + 1)
            ]
            setfrag2LocationList(newList)
           
            oImg.left = locObj.posx
            oImg.top = locObj.posy

            const frag2LocationObj = {
                frag: frag, 
                locationObj: locObj,
                canvasObj: oImg,
                uuid: uuid
            }
            setfrag2LocationList([...frag2LocationList, frag2LocationObj])
            
            editor?.canvas.add(oImg);
        }


    }

    function spawnAtPosition(fragid, posx, posy){
        console.log("fragmentList: " + fragmentList.length)
        for (const frag of fragmentList){
            if (frag._id == fragid){
                const uuid = crypto.randomUUID()
                console.log("VF: adding fragment id: " + frag._id.toString())   
                console.log(frag2LocationList) 

                //if image!
                if (frag.type == "image"){
                    fabric.Image.fromURL(frag.html.split('\"')[1], function (oImg) {
                        doSpawn(oImg, frag, uuid)
                    }, {id: uuid});
                }else{

                    const doc = new DOMParser().parseFromString(frag.html, 'text/html');
                    const xhtml = new XMLSerializer().serializeToString(doc);
                    let svg = '<svg xmlns="http://www.w3.org/2000/svg" display="block"><foreignObject width="200" height="200"><div xmlns="http://www.w3.org/1999/xhtml">'
                    svg += xhtml
                    svg += '</div></foreignObject></svg>'
                    
                    fabric.Image.fromURL('data:image/svg+xml,' + encodeURIComponent(svg), function (oImg) {
                        doSpawn(oImg, frag, uuid)
                    }, {id: uuid});
                }
            }
        }

        function doSpawn(oImg, frag, uuid){
            
            oImg.getScaledHeight() >= oImg.getScaledWidth() ? oImg.scaleToHeight(200) : oImg.scaleToWidth(200)
           
            oImg.left = posx
            oImg.top = posy
            
            
            const frag2LocationObj = {
                frag: frag, 
                locationObj: {
                    height: oImg.getScaledHeight(),
                    width: oImg.getScaledWidth(),
                    posx: posx,
                    posy: posy
                },
                canvasObj: oImg,
                uuid: uuid
            }
            setfrag2LocationList([...frag2LocationList, frag2LocationObj])
            console.log(frag2LocationList)
            
            editor?.canvas.add(oImg);
            console.log("adding to canvas")
        }
    }

    function spawnFragment(fragid){
        if(frag2LocationList.length == 0){
            setLoaded(true) //avoids reload  
        }
        spawnAtPosition(fragid, 10, 10)
    }

    const modifiedHandler = function (event){
        console.log("Entered Handler: " + frag2LocationList)
        for (const frag2obj of frag2LocationList){
            if(frag2obj.uuid == event.target.id){
                console.log("MATCH: " + frag2obj.uuid + " _:_ " + event.target.id)
                

                const i = frag2LocationList.indexOf(frag2obj)
                let newList
                if(frag2LocationList.length == 1){
                    newList = []
                }else{
                    newList = [
                        ...frag2LocationList.slice(0, i),
                        ...frag2LocationList.slice(i + 1)
                    ]
                }   
                console.log("TEMP newlist: " + newList)
                
                console.log("found object to modify: " + frag2obj.frag._id)
                frag2obj.locationObj.posx = event.target.left
                frag2obj.locationObj.posy = event.target.top
                frag2obj.locationObj.height = event.target.getScaledHeight()
                frag2obj.locationObj.width = event.target.getScaledWidth()
                
                setfrag2LocationList([...newList, frag2obj])
            }
            
        }
    }

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