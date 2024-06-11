import { useState, useEffect } from 'react'

import * as Realm from 'realm-web'
import { ObjectId } from 'bson';

import './App.css'

function App() {

  const message = "hi"


  const app_id = import.meta.env.VITE_REALM_APP_KEY

  const app = new Realm.App({id: app_id})


  async function loginEmailPassword(email, password) {
    const credentials = Realm.Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);
    return user;
  }

  async function realm_addNewItem(){
    const user = await loginEmailPassword("or1g20@soton.ac.uk", "realmpass");
    const item = {
      html: "test",
      tags: ["fromReact", "hi"]
    }

    const id = await user.functions.addNewItem("documents", item)
    console.log(id)
    return id
  }

  realm_addNewItem()

  return (
    <>
     
      <p className="test">
        {message}
      </p>
    </>
  )
}

export default App
