import express from 'express'
import cors from 'cors'
import { document_add } from './api.js'

import mult from "multer"
const uploadFolderPath = './uploads/'
const upload = mult({ dest: uploadFolderPath })

const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))

app.get('/hello', (req, res) => {
    console.log("GET /hello recieved")
    res.json({message: "Hello!"})
})


app.post('/document/add', async function (req, res) {
    console.log("POST /document/add recieved")
    console.log(req.body)
    const fn = req.body.fileName
    console.log(fn)

    const fp = uploadFolderPath + fn
    
    const id = await document_add(fp)
    console.log("ID")
    res.send({message: id.toString()})
    
    //res.redirect('/')
  });



/* app.post('/document/add', async (req, res) => {
    console.log("POST /document/add recieved")

    console.log(req.body)
    const fpath = req.body.filepath.toString()
    console.log(fpath)

    const id = await document_add(fp)
    console.log("ID")
    res.send({message: id.toString()})
}) */

app.listen(8000, () => {
    console.log("Server is running on port 8000")
})