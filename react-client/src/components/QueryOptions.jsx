import { Card, CardBody, Input } from "@material-tailwind/react"
import { load } from "cheerio"
import { useState } from "react"
import { query_jq } from "../api/fragment"

function QueryOptions({selectedDocs, setSearchResults, setRightSideHidden}){

    const [attribute, setAttribute] = useState("")
    const [attributeValue, setAttributeValue] = useState("")
    const [element, setElement] = useState("")
    const [elementText, setElementText] = useState("")

    const [customJQ, setCustomJQ] = useState("")



    const handleAttributeChange = (event) =>{
        setAttribute(event.target.value)
    }


    const handleAttributeValueChange = (event) =>{
        setAttributeValue(event.target.value)
    }

    const handleElementChange = (event) =>{
        setElement(event.target.value)
    }

    const handleElementTextChange = (event) =>{
        setElementText(event.target.value)
    }

    const handleCustomJQChange = (event) =>{
        setCustomJQ(event.target.value)
    }

    const startMultiSearch = () =>{
        let searchString = element
        if (elementText != ""){
            searchString += (':contains(\"' + elementText + '\")')
        }
        if (attribute != ""){
            searchString += ('[' + attribute )
            if (attributeValue != ""){ 
                searchString += ("=" + attributeValue + "]")
            }else{
                searchString += ']'
            }
        }

        let matches = []

        for (const doc of selectedDocs){
            const $ = load(doc.html, null, true)
            const outer = $(searchString)

            outer.each((index, element) => {
                var $this = $(element);

                const match = {
                    docid: doc._id,
                    html: $.html($this)
                }
                matches.push(match)
            })
        }

        setSearchResults(matches)
        setRightSideHidden(false)

        console.log(searchString + " : " + matches.toString())
    }



    function startJQSearch(){
        let matches = [];

        for (const doc of selectedDocs){
            let frags = query_jq(doc.html, customJQ);

            for(var frag of frags) {
                let f = {
                    docid: doc._id,
                    html: frag
                };
                matches.push(f);
            }
        }

        setSearchResults(matches)
        setRightSideHidden(false)

        console.log("Query with " + customJQ + " : " + matches.length + ' results')
    }

    return (
        <>
        <div className="query-options">
        <Card className="mt-6 w-200">
        <div className="component-block-vert-xsmall">
        <CardBody>
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Select Query Options</h2>
            
            <div className="component-block-query">
                <div className="component-block-vert-xsmall">
                    <h2 className='mb-4 text-l font-bold leading-none tracking-tight text-gray-900 md:text-l lg:text-l dark:text-white'>Search by HTML Attribute</h2>
                    <Input type="text" onChange={handleAttributeChange} label="Attribute" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> 
                </div>
                
                {attribute != "" ?
                <div className="component-block-vert-xsmall">
                    <h2 className='mb-4 text-l font-bold leading-none tracking-tight text-gray-900 md:text-l lg:text-l dark:text-white'>Specify Attribute Value</h2>
                    <Input type="text" onChange={handleAttributeValueChange} label="Attribute Value" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> 
                </div>
                : <></>}
            </div>

            <div className="component-block-query">
                <div className="component-block-vert-xsmall" key="element">
                        <h2 className='mb-4 text-l font-bold leading-none tracking-tight text-gray-900 md:text-l lg:text-l dark:text-white'>Search by HTML Element</h2>
                        <Input type="text" onChange={handleElementChange} label="Element" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> 
                </div>
                <div className="component-block-vert-xsmall" key="element">
                        <h2 className='mb-4 text-l font-bold leading-none tracking-tight text-gray-900 md:text-l lg:text-l dark:text-white'>Containing this text</h2>
                        <Input type="text" onChange={handleElementTextChange} label="Containing (text)" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> 
                </div>
                : <></>
                
            </div>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startMultiSearch}>Search</button> 
            </CardBody>
        </div>
        </Card>


        <Card className="mt-6 w-200">
        <div className="component-block-vert-xsmall">
        <CardBody>
            <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Custom JQuery Selector</h2>
            
            <div className="component-block-query">
                <div className="component-block-vert-xsmall">
                    <h2 className='mb-4 text-l font-bold leading-none tracking-tight text-gray-900 md:text-l lg:text-l dark:text-white'>JQuery Selector</h2>
                    <Input type="text" onChange={handleCustomJQChange} label="JQuery Selector" className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" /> 
                </div>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startJQSearch}>Search</button> 
            </div>

            
            </CardBody>
        </div>
        </Card>


        </div>
        </>
    )
}

export default QueryOptions