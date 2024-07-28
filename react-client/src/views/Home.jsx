import { ArrowLeftCircleIcon, ArrowLeftEndOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid"

function Home(){


    return(
        <>
            <h1 className='mb-4 text-xl font-semibold leading-none tracking-tight text-gray-900 md:text-xl lg:text-3xl dark:text-white'>Open a workspace or select a tool to get started</h1>
            <ArrowLeftEndOnRectangleIcon className="relative left-60 w-32"></ArrowLeftEndOnRectangleIcon>
        </>
    )
}

export default Home