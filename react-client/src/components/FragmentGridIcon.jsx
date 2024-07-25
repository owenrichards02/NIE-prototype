import DOMPurify from 'dompurify';
import { Card, CardBody } from "@material-tailwind/react"

function FragmentGridIcon({fragment}){


    return(
        <>
        <Card className="h-60 w-full max-w-full rounded-lg object-cover object-center overflow-hidden pb-3">
            <CardBody className="overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fragment.html) }} /> 
            </CardBody>
        </Card>
        
        </>
    )
}    

export default FragmentGridIcon
    
    