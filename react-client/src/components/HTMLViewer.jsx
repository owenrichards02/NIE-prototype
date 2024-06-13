import DOMPurify from "dompurify";
const HTMLViewer = ({html}) => {

    return(
        <>
        <h2>HTML Viewer</h2>
        { <div className="html-window" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} /> }
        </>
    )

}

export default HTMLViewer



