import { useEffect } from "react"
import DraggableFragment from "./DraggableFragment"

function FloorCanvas({fragmentInUseList, setFragmentInUseList}){

    const fragment1 = '<h2>Hello!</h2> <p>this example is so great</p> '
    const x_canvasSize = 1200
    const y_canvasSize = 1000


/*     useEffect(() => {

        setFragmentInUseList([fragment1])

    }, [])
 */
    return(
        <>
        <div className="floorcanvas" style={{width : x_canvasSize.toString() + "px", height : y_canvasSize.toString() + "px"}}>
        {fragmentInUseList.map((item, index) => (
            <DraggableFragment htmlContent={item.html} x_canvasSize={x_canvasSize} y_canvasSize={y_canvasSize}></DraggableFragment>
        ))}
        </div>
        </>
    )
}

export default FloorCanvas