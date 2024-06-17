
import './App.css'
//import { document_add } from './api/react_api';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocumentViewer from './views/DocumentViewer';
import Home from './views/Home';
import Sidebar from './components/Sidebar';

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
            <Route path='/docviewer' Component={DocumentViewer}></Route>
          </Routes>
          </div>
      </BrowserRouter>
          
      </div>
    </>
  )
}

export default App
