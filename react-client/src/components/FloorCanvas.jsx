import DraggableFragment from "./DraggableFragment"

function FloorCanvas(){

    const fragment1 = '<h2>Hello!</h2> <p>this example is so great</p> '
    const x_canvasSize = 1200
    const y_canvasSize = 1000


    return(
        <>
        <div className="floorcanvas" style={{width : x_canvasSize.toString() + "px", height : y_canvasSize.toString() + "px"}}>
        <DraggableFragment htmlContent={fragment1} x_canvasSize={x_canvasSize} y_canvasSize={y_canvasSize}></DraggableFragment>
        </div>
        </>
    )
}

export default FloorCanvas