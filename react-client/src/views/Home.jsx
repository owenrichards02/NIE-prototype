import { ArrowLeftCircleIcon, ArrowLeftEndOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { a2c_atom, currentTab_atom, f2c_atom, openTabs_atom, openTabsCount_atom, recentlyDeletedIndex_atom, vfTabReady_atom, virtualFloors } from "../state"
import VirtualFloor from "./VirtualFloor"
import { RESET } from "jotai/utils"

function Home(){

    const [tabs, setTabs] = useAtom(openTabs_atom)
    const tabsRef = useRef()
    tabsRef.current = tabs
    
    const [currentTab, setCurrentTab] = useAtom(currentTab_atom)
    const currentTabRef = useRef()
    currentTabRef.current = currentTab

    const [f2c, setf2c] = useAtom(f2c_atom)
    const [a2c, seta2c] = useAtom(a2c_atom)

    const [openTabsCount, setOpenTabsCount] = useAtom(openTabsCount_atom)
    const [virtualFloorList, setVirtualFloorList] = useAtom(virtualFloors)
    const [recentlyDeletedIndex, setRecentlyDeletedIndex] = useAtom(recentlyDeletedIndex_atom)
    const recentlyDeletedRef = useRef()
    recentlyDeletedRef.current = recentlyDeletedIndex


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
        setOpenTabsCount(RESET) 
        setf2c(RESET)
        seta2c(RESET)
        setCurrentTab(RESET) */
       
        
        if (currentTabRef.current != {}){
            if(currentTabRef.current.type == "floor"){
                if (tabsRef.current.length > openTabsCount){
                    //new tab
                    if(currentTabRef.current.existing == true){
                        //load from atom
                        let newfObj = f2c
                        let newaObj = a2c
                        for (const vf of virtualFloorList){
                            if(vf._id.toString() == currentTabRef.current.vf_id.toString()){
                                newfObj[currentTabRef.current.index] = vf.floor.f2c
                                console.log("thisF2c: " + vf.floor.f2c)
                                newaObj[currentTabRef.current.index] = vf.floor.a2c
                            }
                        }
                
                        setf2c(newfObj)
                        seta2c(newaObj)
        
                        console.log("setting vfTab ready")
                        setVfTabReady(true)
                        setOpenTabsCount((currentTabCount) => currentTabCount + 1)
                        console.log(vfTabReady)

                    }else{
                         //brand new
                        let newfObj = f2c
                        let newaObj = a2c
        
                        newfObj[currentTabRef.current.index] = []
                        newaObj[currentTabRef.current.index] = []
                        setf2c(newfObj)
                        seta2c(newaObj)
        
                        console.log("setting vfTab ready")
                        setVfTabReady(true)
                        setOpenTabsCount((currentTabCount) => currentTabCount + 1)
                        console.log(vfTabReady)
                    }
                    
                }else if(tabsRef.current.length < openTabsCount){

                    console.log("Deleting index: " + recentlyDeletedRef.current)
                    console.log(f2cRef.current)
                    //tab closed
                    let newa2c = a2cRef.current
                    let newf2c = f2cRef.current

                    

                    for (let i = recentlyDeletedRef.current; i<tabsRef.current.length - 1; i++){
                        newa2c[i] = a2cRef.current[i + 1]
                        newf2c[i] = f2cRef.current[i + 1]
                    }
                    newa2c.splice(tabsRef.current.length - 1, 1)
                    newf2c.splice(tabsRef.current.length - 1, 1)

                    seta2c(newa2c)
                    setf2c(newf2c)


                    setVfTabReady(true)
                    setOpenTabsCount((currentTabCount) => currentTabCount - 1)
                }else{
                    //already open tab               
                    setVfTabReady(true)
                    console.log("making existing tab ready!")
                }
               
            }
        }
        
    }, [currentTabRef.current])

    const showCurrentTab = () => {
        if(vfTabReady){
            if(currentTabRef.current.type == "floor"){
                return(
    
                    <>
    
                    <VirtualFloor tab_index={currentTabRef.current.index} key={currentTabRef.current} changeTabName={changeTabName} savedName_initial={currentTabRef.current.name} savedID_initial={currentTabRef.current.vf_id}></VirtualFloor>
                    
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