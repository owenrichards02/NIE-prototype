import { Card, CardBody } from "@material-tailwind/react"
import DOMPurify from "dompurify"

function FragmentEditorPanel({selectedFragment}){

    return (
        <>
        <div className="fragment-editor-location">
        <Card className="w-[700px] h-5/6">
        <CardBody>
            <h1 className="mb-4 pb-4 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">Selected Fragment</h1>
            <div className="pl-2 pb-6 text-left text-black">
                <b>{selectedFragment.name}</b> <br/>
                <small><b>ID: </b> {selectedFragment._id.toString()}</small> <br/>
                {'type' in selectedFragment ? <small><b>Type: </b>{selectedFragment.type}</small>: <></>}
            </div>
            <div className="html-content-view" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedFragment.html) }} /> 
            <h2 className="mb-4 pt-8 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-2xl dark:text-white">Editor goes here</h2>
            <h2 className="mb-4 pt-8 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-2xl dark:text-white">Annotations</h2>
            
        </CardBody>
        </Card>
        </div>
        
        </>
    )
}

export default FragmentEditorPanel