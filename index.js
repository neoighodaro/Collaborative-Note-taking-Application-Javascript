const express  = require('express')
const app      = express()
let bodyParser = require('body-parser');
let Promise    = require('bluebird');
let db         = require('sqlite');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/scripts'))
app.use(express.static(__dirname + '/styles'))

// ------------------------------------------------------
// Define Routes: API
// ------------------------------------------------------

app.get('/api/notes/:slug', (req, res, next) => {
    try {
        db.get('SELECT * FROM Notes WHERE Slug = ?', req.params.slug).then(row => {
            row = row ? row : {}
            res.json({data:row})
        })
    } catch (err) {
        next(err)
    }
})

app.post('/api/notes', (req, res, next) => {
    try {
        db.run('insert into Notes (Slug) values (?)', req.query.slug).then( query => {
            db.get('SELECT * FROM Notes WHERE ID = ?', query.stmt.lastID)
              .then(row => res.json({data:row}))
        }).catch(e => res.json(e))
    } catch (err) {
        next(err)
    }
})

app.get('/api/notes', (req, res, next) => {
    try {
        db.all('SELECT * FROM Notes').then(row => {
            row = row ? row : []
            res.json({data:row})
        })
    } catch (err) {
      next(err);
    }
})


// ------------------------------------------------------
// Define Routes: Static
// ------------------------------------------------------

app.get('/notes/:slug', (req, res) => res.sendFile(__dirname + '/views/editor.html'))
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'))


// ------------------------------------------------------
// Catch errors
// ------------------------------------------------------

app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// ------------------------------------------------------
// Start application
// ------------------------------------------------------

Promise.resolve()
    .then(()    => db.open('./database/database.sqlite', { Promise }))
    .then(()    => db.migrate({ /*force: 'last',*/ migrationsPath: './database/migrations' }))
    .catch(err  => console.error(err.stack))
    .finally(() => app.listen(3000, () => console.log('App listening on port 3000!')));
