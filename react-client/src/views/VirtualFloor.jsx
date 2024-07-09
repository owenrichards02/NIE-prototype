import { useCallback, useEffect, useRef, useState } from 'react'
import FragmentSelector from '../components/FragmentSelector'
import { useAtom, atom } from 'jotai'
import { RESET, atomWithStorage } from 'jotai/utils'
import { fragments } from '../state'

import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import parse from 'html-react-parser';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
import { Button, Card, CardBody, CardHeader } from '@material-tailwind/react'

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
    const [frag2LocationList, setfrag2LocationList] = useAtom(f2c_atom) //objects {frag, canvasObj, locationObj, uuid}
    const f2lRef = useRef()
    f2lRef.current = frag2LocationList
    
    const [loaded, setLoaded] = useState(false)
    const [isReady, setisReady] = useState(false)

    const { editor, onReady } = useFabricJSEditor()

    useEffect(() => {
        
        editor?.canvas.on('object:modified', objModifiedHandler)
        editor?.canvas.setWidth(x_canvasSize)
        editor?.canvas.setHeight(y_canvasSize) 
    }, [editor]);

    useEffect(() => {
        if(fragmentList.length > 0 && frag2LocationList.length > 0){
            setisReady(true)
        }
        
    }, [fragmentList])

    useEffect(() => {
        if(isReady && loaded == false){
            console.log("Load ready: " + frag2LocationList)
            console.log(frag2LocationList)
            setLoaded(true)
            load()
        }else{      
            console.log("storage not yet loaded")
        }
    }, [isReady])

    function doReset(){
        console.log("resetting virtual floor")
        editor.canvas.clear()
        editor.canvas.setWidth(x_canvasSize)
        editor.canvas.setHeight(y_canvasSize) 
        setfrag2LocationList(RESET)
         //delete to enable storage
    }

    function load(){
        
        console.log("loading from storage, " + frag2LocationList.length)
        console.log(frag2LocationList)
        let toLoad = []
        let uuidsLoaded = []
        for (const f2cObj of frag2LocationList){
            if (uuidsLoaded.includes(f2cObj.uuid)){
                console.log("dupe ignored")
            }else{
                toLoad.push(f2cObj)
                uuidsLoaded.push(f2cObj.uuid)
            }
        }

        for(const f2co of toLoad){
            spawnFromLoad(f2co)
        }
        
    }

    function spawnFromLoad(frag2Location){
        console.log("spawnFromLoad called")
        const frag = frag2Location.frag
        const locObj = frag2Location.locationObj
        const uuid = frag2Location.uuid

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
            //console.log("adding from load")
            
            oImg.scaleToHeight(locObj.height)
            oImg.scaleToWidth(locObj.width)

            const i = frag2LocationList.indexOf(frag2Location)
            let newList
            if (i == 0){
                newList = frag2LocationList.slice(1)
            }else{
                newList = [
                    ...frag2LocationList.slice(0, i),
                    ...frag2LocationList.slice(i + 1)
                ]
            }

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

            let toLoad = []
            let uuidsLoaded = []
            for (const f2cObj of frag2LocationList){
                if (uuidsLoaded.includes(f2cObj.uuid)){
                    console.log("dupe ignored")
                }else{
                    toLoad.push(f2cObj)
                    uuidsLoaded.push(f2cObj.uuid)
                }
            }

            setfrag2LocationList([...toLoad])
            
            editor?.canvas.add(oImg);
        }


    }

    function spawnAtPosition(fragid, posx, posy){
        console.log("spawnAtPosition called")
        //console.log("fragmentList: " + fragmentList.length)
        for (const frag of fragmentList){
            if (frag._id == fragid){
                const uuid = crypto.randomUUID()
                console.log("uuid generated for canvas object instance")
                //console.log("VF: adding fragment id: " + frag._id.toString())   
                //console.log(frag2LocationList) 

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

            let newlist = []
            for (const o of frag2LocationList){
                newlist.push(o)
            }
            newlist.push(frag2LocationObj)
            
            setfrag2LocationList(newlist)
            console.log(frag2LocationList)
            
            editor?.canvas.add(oImg);
            console.log("adding to canvas")
        }
    }

    function spawnFragment(fragid){
        console.log("adding new fragment to canvas")
        if(frag2LocationList.length == 0){
            setLoaded(true) //avoids reload  
        }
        spawnAtPosition(fragid, 10, 10)
    }

    function objModifiedHandler(event){
        const list2use = f2lRef.current
        console.log("Entered Handler: " + list2use)
        let found = false
        const modifiedCanvasObj = event.target
        for (const f2loc of list2use){
            if (f2loc.uuid == modifiedCanvasObj.id){
                console.log("match")
                found = true

                const i = list2use.indexOf(f2loc)
                let newList
                if (i == 0){
                    newList = list2use.slice(1)
                }else{
                    newList = [
                        ...list2use.slice(0, i),
                        ...list2use.slice(i + 1)
                    ]
                }

                const newLocObj = {
                    height: modifiedCanvasObj.getScaledHeight(),
                    width: modifiedCanvasObj.getScaledWidth(),
                    posx: modifiedCanvasObj.left,
                    posy: modifiedCanvasObj.top
                }
                const newObj = {
                    frag: f2loc.frag,
                    canvasObj: f2loc.canvasObj,
                    locationObj: newLocObj,
                    uuid: f2loc.uuid
                }

                setfrag2LocationList([...newList, newObj])
                console.log(list2use)
            }
        }
        
    }

    return(
        <>
        <div id="hi" className='component-block'>
            <div className='component-block-vert-xsmall'>
                <h1 className='vf-title'>Virtual Floor</h1>
                <FabricJSCanvas className="floorcanvas" onReady={onReady} style={{width : x_canvasSize.toString() + "px", height : y_canvasSize.toString() + "px"}} />
                <button className='reset-button' onClick={doReset}>Reset Canvas</button>
            </div>
            <div className='component-block-vert'>
                <FragmentSelector fragmentList={fragmentList} setFragmentList={setFragmentList} spawnFragment={spawnFragment}></FragmentSelector>
            </div>

        </div>
        </>
    )

}

export default VirtualFloor