import { ArrowLeftCircleIcon, ArrowLeftEndOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { a2c_atom, currentTab_atom, f2c_atom, openTabs_atom, openTabsCount_atom, vfTabReady_atom, virtualFloors } from "../state"
import VirtualFloor from "./VirtualFloor"
import { RESET } from "jotai/utils"

function Home(){

    const [tabs, setTabs] = useAtom(openTabs_atom)
    const tabsRef = useRef()
    tabsRef.current = tabs
    const [currentTab, setCurrentTab] = useAtom(currentTab_atom)
    const thisTabRef = useRef()
    thisTabRef.current = currentTab

    const [f2c, setf2c] = useAtom(f2c_atom)
    const [a2c, seta2c] = useAtom(a2c_atom)

    const [currentTabCount, setCurrentTabCount] = useAtom(openTabsCount_atom)
    const [virtualFloorList, setVirtualFloorList] = useAtom(virtualFloors)



    let f2cRef = useRef()
    let a2cRef = useRef()
    f2cRef.current = f2c
    a2cRef.current = a2c

    const [vfTabReady, setVfTabReady] = useAtom(vfTabReady_atom)

    const changeTabName = (newName) => {
        let newCurrent = currentTab
        newCurrent.name = newName
        setCurrentTab(newCurrent)

        let newTabList = []
        for (const tab of tabs){
            if (tab == currentTab){
                newTabList.push(newCurrent)
            }else{
                newTabList.push(tab)
            }
        }
        setTabs(newTabList)
    }
    
    useEffect(() => {
        /* setTabs(RESET)
        setCurrentTabCount(RESET) */
        
        if (thisTabRef.current != {}){
            if(thisTabRef.current.type == "floor"){
                if (tabsRef.current.length > currentTabCount){
                    //new tab
                    if(thisTabRef.current.existing == true){
                        //load from atom
                        let newfObj = f2c
                        let newaObj = a2c
                        for (const vf of virtualFloorList){
                            if(vf._id.toString() == thisTabRef.current.vf_id.toString()){
                                newfObj[thisTabRef.current.index] = vf.floor.f2c
                                console.log("thisF2c: " + vf.floor.f2c)
                                newaObj[thisTabRef.current.index] = vf.floor.a2c
                            }
                        }
                
                        setf2c(newfObj)
                        seta2c(newaObj)
        
                        console.log("setting vfTab ready")
                        setVfTabReady(true)
                        setCurrentTabCount((currentTabCount) => currentTabCount + 1)
                        console.log(vfTabReady)

                    }else{
                        let newfObj = f2c
                        let newaObj = a2c
        
                        newfObj[thisTabRef.current.index] = []
                        newaObj[thisTabRef.current.index] = []
                        setf2c(newfObj)
                        seta2c(newaObj)
        
                        console.log("setting vfTab ready")
                        setVfTabReady(true)
                        setCurrentTabCount((currentTabCount) => currentTabCount + 1)
                        console.log(vfTabReady)
                    }
                    
                }else{
                    //already open tab               
                    setVfTabReady(true)
                    console.log("making existing tab ready!")
                }
               
            }
        }
        
    }, [thisTabRef.current])

    const showCurrentTab = () => {
        if(vfTabReady){
            if(thisTabRef.current.type == "floor"){
                return(
    
                    <>
    
                    <VirtualFloor tab_index={thisTabRef.current.index} key={thisTabRef.current} changeTabName={changeTabName}></VirtualFloor>
                    
                    </>
                )
            }
        }else{
            return (
                <h1 className='mb-4 text-xl font-semibold leading-none tracking-tight text-gray-900 md:text-xl lg:text-3xl dark:text-white'>Loading...</h1>
            )
        }
        
        
    }

    return(
        <>
            {tabs.length == 0 ? <div>
                <h1 className='mb-4 text-xl font-semibold leading-none tracking-tight text-gray-900 md:text-xl lg:text-3xl dark:text-white'>Open a workspace or select a tool to get started</h1>
                <ArrowLeftEndOnRectangleIcon className="relative left-60 w-32"></ArrowLeftEndOnRectangleIcon>
                </div>
            : showCurrentTab()}
        </>
    )
}

export default Home