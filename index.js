// ------------------------------------------------------
// Import Node Modules...
// ------------------------------------------------------

const express    = require('express')
const bodyParser = require('body-parser')

// ------------------------------------------------------
// Create the Express app
// ------------------------------------------------------

const app = express()
let data = {}

// ------------------------------------------------------
// Load the middlewares
// ------------------------------------------------------

app.use(bodyParser.json());
app.use(express.static(__dirname + '/assets'))
app.use(bodyParser.urlencoded({ extended: false }));


// ------------------------------------------------------
// Helper function(s)
// ------------------------------------------------------

function slugify(text) {
    return text.toString().toLowerCase().trim()
               .replace(/\s+/g, '-')
               .replace(/[^\w\-]+/g, '')
               .replace(/\-\-+/g, '-')
               .replace(/^-+/, '')
               .replace(/-+$/, '')
}

function randomString(count) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < count; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}


// ------------------------------------------------------
// API Routes
// ------------------------------------------------------

app.get('/api/notes/:slug', (req, res, next) => {
    if (data[req.params.slug] === undefined) {
        res.status(404).json({status: 'error'})
    } else {
        res.json({data:data[req.params.slug]})
    }
})

app.get('/api/notes', (req, res, next) => res.json({data}))

app.post('/api/notes', (req, res, next) => {
    const title = randomString(24)

    res.json({data: data[title] = {Slug: title, Title: "Untitled Note"}})
})

app.put('/api/notes/:slug', (req, res, next) => {
    if (data[req.params.slug] === undefined) {
        res.status(404).json({status: 'error'})
    } else {
        data[req.params.slug]["Title"] = req.body.title
        res.json({status: "ok"})
    }
})


// ------------------------------------------------------
// Define Routes: Static
// ------------------------------------------------------

app.get('/notes/:slug', (req, res) => res.sendFile(__dirname + '/views/editor.html'))
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'))

// ------------------------------------------------------
// Start application
// ------------------------------------------------------

app.listen(3000, () => console.log('App listening on port 3000!'))
