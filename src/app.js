const express = require('express')
const customapi = require('./customapi')

const app = express()
const PORT = 5500
app.use(express.json())
app.use('/customapi', customapi)

app.get('/', (req, res) => {
  res.json("hello!")
})

app.get('/schema1', (req, res) => {
  const file = '/tmp/staging_dump_plain.psql'
  res.download(file)
})

app.get('/schema', (req, res) => {
  const file = '/tmp/staging_dump.psql'
  res.download(file)
})

app.post("/webhook", (req, res) => {
    console.log(req.body)
    // console.log(req.body['data'])
    // res.status(400).json(req.body['data'].map(f => f['unique_id']))
    res.send('You have hit the webhook');
})

app.head("/webhook2", (req, res) => {
    console.log(req._parsedUrl)
    res.send("You have hit header webhook")
})

app.listen(PORT, () => {
  console.info(`App listening on port ${PORT}`)
})