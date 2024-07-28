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
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
   
function Sidebar() {


    const navigate = useNavigate()
    
    const nav = (route) => {
        navigate("/" + route)
        console.log("moving to: /" + route)
    }

    const [openDia, setOpenDia] = React.useState(false);
    const [openAccordion, setOpenAccordion] = React.useState(false);

 
    const handleOpenDia = () => setOpenDia(!openDia);

    const handleOpenAccordion = (value) => setOpenAccordion(openAccordion === value ? 0 : value);

    
    return (
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-3 shadow-xl shadow-blue-gray-600 text-black">
        <h1 className="block antialiased tracking-normal text-4xl pb-4">Neighbourhood Insight Engine</h1> <br/>
        <h2 className="block antialiased tracking-normal text-2xl font-semibold pb-0 text-left pl-2">Tools</h2>
        <List>         
          <ListItem onClick={() => nav("doc-viewer")}>
            <ListItemPrefix>
              <DocumentIcon className="h-6 w-6" />
            </ListItemPrefix>
            <h2 className="block antialiased tracking-normal text-xl">Document Viewer</h2>
          </ListItem>

          <ListItem onClick={() => nav("my-frags")}>
            <ListItemPrefix>
              <PuzzlePieceIcon className="h-6 w-6" />
            </ListItemPrefix>
            <h2 className="block antialiased tracking-normal text-xl">My Fragments</h2>
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
              <Typography color="blue-gray" className="mr-auto">
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

          <ListItem onClick={() => nav("virtual-floor")}>
            <ListItemPrefix>
              <RectangleGroupIcon className="h-6 w-6" />
            </ListItemPrefix>
            <div className="component-block-vert-xsmall">
            <h2 className="block antialiased tracking-normal text-xl">Virtual Floor</h2> 
            <i>Will remove later</i>
            </div>
          </ListItem>

        </List>

        <h2 className="block antialiased tracking-normal text-2xl font-semibold pt-10 pb-3 text-left pl-2">Workspaces</h2>
        <List>
        <ListItem onClick={handleOpenDia} className="outline-dotted">
            <ListItemPrefix>
              <PlusIcon className="h-6 w-6" />
            </ListItemPrefix>
            <h2 className="block antialiased tracking-normal text-xl">Open New Workspace</h2>
        </ListItem>

        <Dialog open={openDia} handler={handleOpenDia} size="sm">
          <DialogHeader>
            <h1 className="text-3xl">What would you like to open?</h1>
            </DialogHeader>
          <DialogBody>
          <div className="component-block-dia relative left-20">
            <Card className="w-60 h-40 bg-gray-100 hover:bg-gray-200" onClick={handleOpenDia}>
              <CardBody>
                <div className="component-block-vert-small">
                <h2 className="block antialiased tracking-normal text-2xl font-bold text-center ">Virtual Floor</h2>
                <RectangleGroupIcon className="h-16 w-16 relative left-16 bottom-8"></RectangleGroupIcon>
                </div>
              </CardBody>
            </Card>
            <Card className="w-60 h-40 bg-gray-100 hover:bg-gray-200" onClick={handleOpenDia}>
              <CardBody>
                <div className="component-block-vert-small">
                <h2 className="block antialiased tracking-normal text-2xl font-bold text-center ">Document View</h2>
                <DocumentDuplicateIcon className="h-16 w-16 relative left-16 bottom-8"></DocumentDuplicateIcon>
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
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
          </DialogFooter>
        </Dialog>

        </List>
      </Card>
    );
}

export default Sidebar