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
  } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
   
function Sidebar() {


    const navigate = useNavigate()
    
    const nav = (route) => {
        navigate("/" + route)
        console.log("moving to: /" + route)
    }

    const [open, setOpen] = React.useState(0);
 
    const handleOpen = (value) => {
      setOpen(open === value ? 0 : value);
    };

    
    return (
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-600">
        <h1 className="block antialiased tracking-normal text-4xl">Neighbourhood Insight Engine</h1> <br/>
        <List>         
          <ListItem onClick={() => nav("")}>
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            Home
          </ListItem>

          <ListItem onClick={() => nav("doc-viewer")}>
            <ListItemPrefix>
              <DocumentIcon className="h-5 w-5" />
            </ListItemPrefix>
            Document Viewer
          </ListItem>

          <ListItem onClick={() => nav("my-frags")}>
            <ListItemPrefix>
              <PuzzlePieceIcon className="h-5 w-5" />
            </ListItemPrefix>
            My Fragments
          </ListItem>



          {/* FRAGMENT EXTRACTORS */}
          <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <ListItemPrefix>
                <SquaresPlusIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto">
                Fragment Extractors
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
              <RectangleGroupIcon className="h-5 w-5" />
            </ListItemPrefix>
            Virtual Floor
          </ListItem>

        </List>
      </Card>
    );
}

export default Sidebar