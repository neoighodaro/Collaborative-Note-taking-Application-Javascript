const express = require('express')
const app     = express()

app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/scripts'))
app.use(express.static(__dirname + '/styles'))

app.get('/', (req, res) => res.sendFile('index.html'))

app.listen(3000, () => console.log("Application running at Port 3000!"))
