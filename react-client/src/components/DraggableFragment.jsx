import DOMPurify from "dompurify";
import React, { createRef } from "react";
import Draggable from "react-draggable";

function DraggableFragment({htmlContent}){

    const nullref = React.useRef(null)

    return (
        <>
        <Draggable nodeRef={nullref}>
            { <div ref={nullref} className="fragment-box" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} /> }
        </Draggable>
        </>
    )
}

export default DraggableFragment
