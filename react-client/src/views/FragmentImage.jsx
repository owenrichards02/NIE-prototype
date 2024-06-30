import { useAtom } from "jotai";
import { fragments } from "../state"

function FragmentImage(){

    const [fragmentList, setFragmentList] = useAtom(fragments)


    return(
        <>
        Hello
        </>
    )
}

export default FragmentImage