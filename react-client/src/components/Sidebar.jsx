import {
    Card,
    Typography,
    List,
    ListItem,
    Box,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
  } from "@material-tailwind/react";
  import {
    HomeIcon,
    DocumentIcon,
    SquaresPlusIcon,
  } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
   
function Sidebar() {


    const navigate = useNavigate()
    
    const nav = (route) => {
        navigate("/" + route)
        console.log("moving to: /" + route)
    }

    
    return (
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/2">
        <h1 className="block antialiased tracking-normal text-4xl">Neighbourhood Insight Engine</h1> <br/>
        <List>         
          <ListItem onClick={() => nav("")}>
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            Home
          </ListItem>

          <ListItem onClick={() => nav("docviewer")}>
            <ListItemPrefix>
              <DocumentIcon className="h-5 w-5" />
            </ListItemPrefix>
            Document Viewer
          </ListItem>

          <ListItem onClick={() => nav("virtualfloor")}>
            <ListItemPrefix>
              <SquaresPlusIcon className="h-5 w-5" />
            </ListItemPrefix>
            Virtual Floor
          </ListItem>

        </List>
      </Card>
    );
}

export default Sidebar