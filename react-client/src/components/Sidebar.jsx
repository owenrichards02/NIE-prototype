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
        <div className="mb-2 p-4">
          <Typography variant="h2" color="blue-gray" >
            Neighbourhood Insight Engine
          </Typography>
        </div>
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

        </List>
      </Card>
    );
}

export default Sidebar