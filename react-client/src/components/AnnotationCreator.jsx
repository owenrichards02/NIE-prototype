function AnnotationCreator({selObjRef, f2lRef}){


return(
    <>
    <div className="annotation-creator">

    <div className="component-block-vert-small">
        <h2 className='mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white'>Annotation Creator</h2>
        {selObjRef.current.map((item, index) => (
            <>
            {item.id}
            <br />
            </>
        ))}
        <br />
    </div>
    </div>
    </>
)

}

export default AnnotationCreator