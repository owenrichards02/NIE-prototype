import { useState, useEffect } from 'react'

import 'dotenv/config'


import * as Realm from 'realm-web'

import './App.css'

function App() {

  const message = "hi"


  const appid = process.env.REACT_APP_REALM_APP_ID
  console.log(appid)
  const config = {
    appid
  };


  const app = new Realm.App(config)


  return (
    <>
     
      <p className="test">
        {message}
      </p>
    </>
  )
}

export default App
