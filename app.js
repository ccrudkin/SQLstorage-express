const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite = require('sqlite3');

// const expressValidator = require('express-validator'); // add validator later

const app = express();

// Open database
const db = new sqlite.Database('data.db');
const tbl = 'sampledata'

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// render main page with catalog info
app.get('/', (req, res) => {
    db.all('SELECT * FROM ' + tbl, (error, rows) => {
        if (!error) {
            res.render('saver', {
                catalog: rows,
            });
        } else {
            console.log(error);
        }
    });    
});

// send full catalog
app.get('/=load_catalog', (req, res) => {
    console.log('Catalog generate request received.');
    db.all('SELECT * FROM ' + tbl, (error, rows) => {
        if (!error) {
            res.send(rows);
        } else {
            console.log(error);
        }
    });    
});

// insert new catalog entry via POST request, respond with success message
app.post('/new-entry', (req, res) => {
    console.log('New entry post request received: ' + req.body.name);
    db.run('INSERT INTO ' + tbl + ' (name, species, location) VALUES ($n, $s, $l)', 
    {
        $n: req.body.name,
        $s: req.body.species,
        $l: req.body.location
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Successfully added ' + req.body.name + ' to database.');
            res.send('Success.');
        }
    });
});

// Render /data page with data populated from var nm above
app.get('/data', (req, res) => {
    db.all('SELECT * FROM ' + tbl, (error, rows) => {
        if (error) {
            console.log(error);
        } else {
            res.render('dataLib', {
                data_obj: rows
            });
        }
    })
});

// Synchronous datafetch test
app.get('/data/more', (req, res) => {
    console.log('Get request received.');
    db.get('SELECT * FROM ' + tbl + ' WHERE id = 3', (error, row) => {
        if (!error) {
            res.send(`${row.name} is of species ${row.species}. Current location: ${row.location}`);
        } else {
            console.log(error);
        }
    });
});

// Lookup a user-entered ID
app.get('/lookup/:entryID', (req, res) => {
    db.get('SELECT * FROM ' + tbl + ' WHERE id = $ID', {
        $ID: req.params.entryID
    }, (err, row) => {
        if (err) {
            throw err;
        } else {
            res.send(row);
        }
    }
    )
});

// delete from database
app.get('/delete/:entryID', (req, res) => {
    console.log('Request to delete ' + req.params.entryID);
    db.run('DELETE FROM ' + tbl + ' WHERE id = $ID', {
        $ID: req.params.entryID
    }, (err) => {
        if (err) {
            throw err;
        } else {
            res.send('Request processed.');
        }
    }
    )
});

app.listen(3000, function() {
    console.log('Server started on port 3000...');
});