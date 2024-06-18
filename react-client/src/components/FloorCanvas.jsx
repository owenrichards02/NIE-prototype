import DraggableFragment from "./DraggableFragment"

function FloorCanvas(){

    const fragment1 = '<h2>Hello!</h2> <p>this example is so great</p> '

    return(
        <>
        <DraggableFragment htmlContent={fragment1}></DraggableFragment>
        </>
    )
}

export default FloorCanvas