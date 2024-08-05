import { useAtom } from "jotai";
import FragmentGridIcon from "./FragmentGridIcon";
import { fragments } from "../state";

function FragmentGrid({subsetList, selectedFragment, setSelectedFragment}){

    return(
        <ul className="fragment-grid-location h-5/6 w-1/2 overflow-y-auto overflow-x-hidden grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 p-1">
            {subsetList.map((item, index) => (
                <li key={item._id}>
                <FragmentGridIcon fragment={item} selectedFragment={selectedFragment} setSelectedFragment={setSelectedFragment}></FragmentGridIcon>
                </li>
            ))}
        </ul>
    )
}

export default FragmentGrid