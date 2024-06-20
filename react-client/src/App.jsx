
import './App.css'
//import { document_add } from './api/react_api';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocumentViewer from './views/DocumentViewer';
import Home from './views/Home';
import Sidebar from './components/Sidebar';
import VirtualFloor from './views/VirtualFloor';
import FragmentExtractorTextual from './views/FragmentExtractorTextual';
import FragmentExtractorQuery from './views/FragmentExtractorQuery';

function App() {


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
            <Route path='/virtual-floor' Component={VirtualFloor}></Route>
          </Routes>
          </div>
      </BrowserRouter>
          
      </div>
    </>
  )
}

export default App
