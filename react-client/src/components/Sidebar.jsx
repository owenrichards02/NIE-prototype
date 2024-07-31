import {
    Card,
    Typography,
    List,
    ListItem,
    Box,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    CardBody,
  } from "@material-tailwind/react";
  import {
    HomeIcon,
    DocumentIcon,
    SquaresPlusIcon,
    ArrowUpOnSquareStackIcon,
    PuzzlePieceIcon,
    RectangleGroupIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    PlusCircleIcon,
    PlusIcon,
    DocumentDuplicateIcon,
  } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { currentTab_atom, openTabs_atom, vfTabReady_atom } from "../state";
   
function Sidebar() {

    const navigate = useNavigate()

    const location = useLocation()
    
    const nav = (route) => {
        navigate("/" + route)
        console.log("moving to: /" + route)
    }

    const [openDia, setOpenDia] = React.useState(false);
    const [openAccordion, setOpenAccordion] = React.useState(false);
 
    const handleOpenDia = () => setOpenDia(!openDia);

    const handleOpenAccordion = (value) => setOpenAccordion(openAccordion === value ? 0 : value);

    const [tabs, setTabs] = useAtom(openTabs_atom)
    const tabsRef = useRef()
    tabsRef.current = tabs
    const [currentTab, setCurrentTab] = useAtom(currentTab_atom)
    const [vfTabReady, setVfTabReady] = useAtom(vfTabReady_atom)


    const newFloorCreated = () =>{
      const { hash, pathname, search } = location
      if(pathname != "/"){
        navigate("/")
      }
      handleOpenDia()
      setVfTabReady(false)
      const uuid = crypto.randomUUID()
      const newFloor = {
        type: "floor",
        key: uuid,
        index: tabs.length,
        name: "Virtual Floor " + tabs.length
      }
      setTabs((tabs) => [...tabs, newFloor])
      console.log("switching to tab " + tabs.length)
      setCurrentTab(newFloor)
    }

    const existingTabSwitchedTo = (index) => {
      const { hash, pathname, search } = location
      if(pathname != "/"){
        navigate("/")
      }
      setVfTabReady(false)
      console.log("switching to tab " + index)
      setCurrentTab(tabsRef.current[index])
    }
    
    return (
      <>
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-3 shadow-xl shadow-blue-gray-600 text-black">
        <h1 className="block antialiased tracking-normal text-4xl pb-4">Neighbourhood Insight Engine</h1> <br/>
        <h2 className="block antialiased tracking-normal text-2xl font-semibold pb-0 text-left pl-2">Tools</h2>
        <List>         
          <ListItem onClick={() => nav("doc-viewer")}>
            <ListItemPrefix>
              <DocumentIcon className="h-6 w-6" />
            </ListItemPrefix>
            <Typography color="black" className="mr-auto">
            <h2 className="block antialiased tracking-normal text-xl">Document Viewer</h2>
            </Typography>
          </ListItem>

          <ListItem onClick={() => nav("my-frags")}>
            <ListItemPrefix>
              <PuzzlePieceIcon className="h-6 w-6" />
            </ListItemPrefix>
            <Typography color="black" className="mr-auto">
            <h2 className="block antialiased tracking-normal text-xl">My Fragments</h2>
            </Typography>
          </ListItem>



          {/* FRAGMENT EXTRACTORS */}
          <Accordion
          open={openAccordion === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${openAccordion === 1 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={openAccordion === 1}>
            <AccordionHeader onClick={() => handleOpenAccordion(1)} className="border-b-0 p-3">
              <ListItemPrefix>
                <SquaresPlusIcon className="h-6 w-6" />
              </ListItemPrefix>
              <Typography color="black" className="mr-auto">
              <h2 className="block antialiased tracking-normal text-xl">Fragment Extractors</h2>
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem onClick={() => nav("frag-extract-textual")}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Use Textual Elements
              </ListItem>
              <ListItem onClick={() => nav("frag-extract-query")}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Query Specific Elements
              </ListItem>
              <ListItem onClick={() => nav("frag-image")}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Create Image Fragment
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>

        </List>

        <h2 className="block antialiased tracking-normal text-2xl font-semibold pt-10 pb-3 text-left pl-2">Workspaces</h2>
        <List className="gap-4">


        {/* EACH TAB ICON */}
        {tabs.map((item, _) => (
            <ListItem onClick={() => existingTabSwitchedTo(item.index)} className="outline" key={item.key}>
              <ListItemPrefix>
                {item.type == "floor" ? 
                <RectangleGroupIcon className="h-6 w-6" /> : <DocumentDuplicateIcon className="h-6 w-6"></DocumentDuplicateIcon>}
              </ListItemPrefix>
              <Typography color="black" className="mr-auto">
              <h2 className="block antialiased tracking-normal text-xl">{item.name}</h2>
              </Typography>
            </ListItem>
        ))}




        <ListItem onClick={handleOpenDia} className="outline-dotted" key={"newWorkspace"}>
            <ListItemPrefix>
              <PlusIcon className="h-6 w-6" />
            </ListItemPrefix>
            <Typography color="black" className="mr-auto">
            <h2 className="block antialiased tracking-normal text-xl">Open New Workspace</h2>
            </Typography>
        </ListItem>

        <Dialog open={openDia} handler={handleOpenDia} size="sm">
          <DialogHeader>
            <h1 className="text-3xl">What would you like to open?</h1>
            </DialogHeader>
          <DialogBody>
          <div className="component-block-dia relative left-14 !gap-32">
            <div className="component-block-vert-xsmall3 !gap-8">

              <Card className="w-60 h-40 bg-[#cdb1fa] hover:bg-[#bf96ff]" onClick={newFloorCreated}>
                <CardBody>
                    <div className="component-block-vert-small">
                    <Typography color="white">
                    <h2 className="block antialiased tracking-normal text-2xl font-extrabold text-center ">New Virtual Floor</h2>
                    </Typography>
                    <div className="component-block-annot">
                    <PlusIcon className="h-12 w-12 relative pt-4 left-8 bottom-8 fill-white"></PlusIcon>
                    <RectangleGroupIcon className="h-16 w-16 relative left-0 bottom-8 fill-white"></RectangleGroupIcon>
                    </div>
                    </div>
                  
                </CardBody>
              </Card>

              <Card className="w-62 h-36 bg-[#a8d5ff] hover:bg-[#94c8f7]" onClick={handleOpenDia}>
                <CardBody>
                    <div className="component-block-vert-small">
                    <Typography color="black">
                    <h2 className="block antialiased tracking-normal text-xl font-bold text-center ">Load Existing Floor</h2>
                    </Typography>
                    <RectangleGroupIcon className="h-14 w-14 relative left-16 bottom-8 "></RectangleGroupIcon>
                    </div>
                  
                </CardBody>
              </Card>
            </div>
            <Card className="w-60 h-76 bg-[#cdb1fa] hover:bg-[#bf96ff]" onClick={handleOpenDia}>
              <CardBody>
                <div className="component-block-vert-small relative top-16">
                <Typography color="white">
                <h2 className="block antialiased tracking-normal text-2xl font-bold text-center ">Document View</h2>
                </Typography>
                <DocumentDuplicateIcon className="h-16 w-16 relative left-16 bottom-8 fill-white"></DocumentDuplicateIcon>
                </div>
              </CardBody>
            </Card>
          </div>

          

          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpenDia}
              className="mr-1 text-lg"
            >
              <span>Cancel</span>
            </Button>
          </DialogFooter>
        </Dialog>

        </List>
      </Card>
      </>
    );
}

export default Sidebar