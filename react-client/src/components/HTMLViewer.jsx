import { Switch } from "@material-tailwind/react";
import DOMPurify from "dompurify";
import { useRef, useState } from "react";
const HTMLViewer = ({html}) => {

    const [ticked, setTicked] = useState(true)

    const doSwitch = () =>{
        setTicked(!ticked)
    }

    return(
        <>
        <div className="html-window w-[700px]">
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white '>HTML Viewer</h2>
            
            <div className="component-block-switch">
            <b>Raw HTML</b>
            <Switch className="h-full w-full checked:bg-[#2ec946]"
                containerProps={{
                    className: "w-11 h-6",
                }}
                circleProps={{
                    className: "before:hidden left-6 border-none",
                }} onChange={doSwitch} defaultChecked></Switch> 
            <b>Rendered</b>
            </div>
           {ticked ?  <div className="html-content-view" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />  : <div className="html-content-view">{html}</div>}
            
        </div>
        </>
    )

}

export default HTMLViewer



