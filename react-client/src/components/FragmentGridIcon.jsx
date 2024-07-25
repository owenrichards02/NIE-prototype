import DOMPurify from 'dompurify';
import { Card, CardBody } from "@material-tailwind/react"

function FragmentGridIcon({fragment, selectedFragment, setSelectedFragment}){

    function selectFragment(){
        setSelectedFragment(fragment)
    }

    return(
        <>
        <div className='z-10 transition duration-300 ease-in-out hover:scale-103 p-1' onClick={selectFragment}>
        {selectedFragment == fragment ? <div className='outline-dotted outline-amethyst rounded'>
        <Card className="h-60 w-full max-w-full rounded-lg object-cover object-center pb-3">
            <CardBody className="overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fragment.html) }} /> 
            </CardBody>
        </Card>
        </div> :  <Card className="h-60 w-full max-w-full rounded-lg object-cover object-center pb-3">
                        <CardBody className="overflow-hidden">
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fragment.html) }} /> 
                        </CardBody>
                    </Card>}
        </div>
        
        </>
    )
}    

export default FragmentGridIcon
    
    