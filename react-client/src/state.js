import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const documents = atom([])
export const fragments = atom([])
export const annotations = atom([])

export const openTabs_atom = atomWithStorage('opentabs',[])
export const currentTab_atom = atom({})
export const vfTabReady_atom = atom(false)

export const f2c_atom = atomWithStorage('frag2canvas', [])
export const a2c_atom = atomWithStorage('annot2canvas', [])