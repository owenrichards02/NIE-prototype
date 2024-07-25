import { useAtom } from "jotai";
import FragmentGridIcon from "./FragmentGridIcon";
import { fragments } from "../state";

function FragmentGrid({subsetList, setSubsetList}){

    return(
        <ul className="fragment-grid-location w-1/2 h-5/6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 overflow-auto">
            {subsetList.map((item, index) => (
                <li key={item._id}>
                <FragmentGridIcon fragment={item}></FragmentGridIcon>
                </li>
            ))}
        </ul>
    )
}

export default FragmentGrid