
import './App.css'
//import { document_add } from './api/react_api';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocumentViewer from './views/DocumentViewer';
import Home from './views/Home';
import Sidebar from './components/Sidebar';
import VirtualFloor from './views/VirtualFloor';
import FragmentExtractorTextual from './views/FragmentExtractorTextual';
import FragmentExtractorQuery from './views/FragmentExtractorQuery';
import { documents } from './state';
import { useAtom } from 'jotai';
import { documents_findAll } from './api/react_api';
import { useEffect } from 'react';
import FragmentImage from './views/FragmentImage';


function App() {

  const [documentList, setDocumentList] = useAtom(documents)

  
  useEffect(() => {
    async function loadAllDocs(){
    const docList = await documents_findAll()

    let newlist = []
    for (const doc of docList){
        newlist.push(doc)
    }
    setDocumentList([...documentList, ...newlist])
    }

    loadAllDocs()

}, [])


  /* useEffect(() => {
    setDocumentIDList([...documentIDList, "itemFromApp"])
  }, []) */
  

/*   const item = {
    html: "Test html",
    name: "filenameTest", 
    data: null,
    tags: ["hello", "there"]
  } */

  /* async function testAdd(){
    const id = await document_add(fp)
    console.log(id)
  } */
  
  //testAdd()


  return (
    <>
      <div className='component-block'>
      <BrowserRouter>
        <div className='side-panel'>
          <Sidebar></Sidebar>
        </div>
          <div>
          <Routes>
            <Route path='/' Component={Home}></Route>
            <Route path='/doc-viewer' Component={DocumentViewer}></Route>
            <Route path='/frag-extract-textual' Component={FragmentExtractorTextual}></Route>
            <Route path='/frag-extract-query' Component={FragmentExtractorQuery}></Route>
            <Route path='/frag-image' Component={FragmentImage}></Route>
            <Route path='/virtual-floor' Component={VirtualFloor}></Route>
          </Routes>
          </div>
      </BrowserRouter>
          
      </div>
    </>
  )
}

export default App
