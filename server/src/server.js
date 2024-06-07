import express from 'express'
import cors from 'cors'
import { document_add } from './api.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/hello', (req, res) => {
    console.log("GET /hello recieved")
    res.json({message: "Hello!"})
})

app.post('/document/add', async (req, res) => {
    console.log("POST /document/add recieved")

    console.log(req.body)
    const fpath = req.body.filepath.toString()
    console.log(fpath)
    const id = await document_add(fpath)
    console.log("ID")
    res.send({message: id.toString()})
})

app.listen(8000, () => {
    console.log("Server is running on port 8000")
})