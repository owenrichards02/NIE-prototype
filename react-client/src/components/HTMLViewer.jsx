import DOMPurify from "dompurify";
const HTMLViewer = ({html}) => {

    return(
        <>
        <div className="html-window">
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>HTML Viewer</h2>
            { <div className="html-content-view" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} /> }
        </div>
        </>
    )

}

export default HTMLViewer



