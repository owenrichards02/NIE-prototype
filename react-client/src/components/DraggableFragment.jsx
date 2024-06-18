import { Card, CardBody } from "@material-tailwind/react";
import DOMPurify from "dompurify";
import React, { createRef } from "react";
import Draggable from "react-draggable";

function DraggableFragment({htmlContent, x_canvasSize, y_canvasSize}){

    const nullref = React.useRef(null)

    const bounds = {
        left: 0,
        top: 0,
        right: x_canvasSize, // -fragment_size_x
        bottom: y_canvasSize // -fragment_size_y
    }

    //make bounds dynamic using state, so that they update after fragment size is known

    const offset = {
        x: '0%',
        y: '0%'
    }

    return (
        <>
        <Draggable positionOffset={offset} bounds={bounds} nodeRef={nullref}>
            { <div ref={nullref} className="fragment-box" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> }
        </Draggable>
        </>
    )
}

export default DraggableFragment
