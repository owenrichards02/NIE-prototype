import { Input } from "@material-tailwind/react"

function QueryOptions(){

    function handleAttributeChange(){

    }

    function handleAttributeValueChange(){

    }

    function handleElementChange(){

    }

    function startSearch(){

    }

    return (
        <>
        <div className="query-options">
        <div className="component-block-vert-small">
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Select Query Options</h2>

            <div className="component-block-query">
                <div className="component-block-vert-xsmall">
                    <h2 className='mb-4 text-l font-extrabold leading-none tracking-tight text-gray-900 md:text-l lg:text-l dark:text-white'>Search by HTML Attribute</h2>
                    <Input type="text" onChange={handleAttributeChange} label="Attribute" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> 
                </div>

                <div className="component-block-vert-xsmall">
                    <h2 className='mb-4 text-l font-extrabold leading-none tracking-tight text-gray-900 md:text-l lg:text-l dark:text-white'>Specify Attribute Value</h2>
                    <Input type="text" onChange={handleAttributeValueChange} label="Attribute Value" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> 
                </div>
            </div>

            <div className="component-block-query">
                <div className="component-block-vert-xsmall" key="element">
                        <h2 className='mb-4 text-l font-extrabold leading-none tracking-tight text-gray-900 md:text-l lg:text-l dark:text-white'>Search by HTML Element</h2>
                        <Input type="text" onChange={handleElementChange} label="Element" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> 
                </div>

            </div>

            <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startSearch}>Search</button> 
                </div> 

            <div>
            
            </div>
    
        </div>
        </div>
        </>
    )
}

export default QueryOptions