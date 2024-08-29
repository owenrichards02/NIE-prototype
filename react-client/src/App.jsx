
import './App.css'
//import { document_add } from './api/react_api';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocumentViewer from './views/DocumentViewer';
import Sidebar from './components/Sidebar';
import VirtualFloor from './views/VirtualFloor';
import FragmentExtractorTextual from './views/FragmentExtractorTextual';
import FragmentExtractorQuery from './views/FragmentExtractorQuery';
import { annotations, documents, virtualFloors } from './state';
import { useAtom } from 'jotai';
import { annotations_findAll, documents_findAll, floors_findAll } from './api/react_api';
import { useEffect } from 'react';
import FragmentImage from './views/FragmentImage';

import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';
import MyFragments from './views/MyFragments';
import WorkspaceArea from './views/WorkspaceArea';

function App() {

  const [documentList, setDocumentList] = useAtom(documents)
  const [annotationList, setAnnotationList] = useAtom(annotations)
  const [virtualFloorList, setVirtualFloorList] = useAtom(virtualFloors)
  
  useEffect(() => {
    async function loadAllDocs(){
    const docList = await documents_findAll()

    setDocumentList(docList)
    }

    async function loadAllAnnots(){
      const annotList = await annotations_findAll()

      setAnnotationList(annotList)
    }

    async function loadAllFloors(){
      const floorList = await floors_findAll()
      setVirtualFloorList(floorList)
    }

    loadAllDocs()
    loadAllAnnots()
    loadAllFloors()

}, [])

  return (
    <>
      <DevTools/>
      <div className='whole-application'>
        <div className='component-block'>
        <BrowserRouter>
          <div className='side-panel'>
            <Sidebar></Sidebar>
          </div>
            <div>
            <Routes>
              <Route path='/' Component={WorkspaceArea}></Route>
              <Route path='/doc-viewer' Component={DocumentViewer}></Route>
              <Route path='/my-frags' Component={MyFragments}></Route>
              <Route path='/frag-extract-textual' Component={FragmentExtractorTextual}></Route>
              <Route path='/frag-extract-query' Component={FragmentExtractorQuery}></Route>
              <Route path='/frag-image' Component={FragmentImage}></Route>
            </Routes>
            </div>
        </BrowserRouter>
            
        </div>
      </div>
      
      
    </>
  )
}

export default App
