import DOMPurify from "dompurify";
const HTMLViewer = ({html}) => {

    return(
        <>
        <div className="html-window">
            <h2>HTML Viewer</h2>
            { <div className="html-content-view" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} /> }
        </div>
        </>
    )

}

export default HTMLViewer



