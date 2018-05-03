const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const expressValidator = require('express-validator'); // add validator later

const app = express();

/*
const logger = function (req, res, next) {
    console.log('Logging...');
    next();
}

app.use(logger);
*/

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

const users = [
    {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@gmail.com',
    },
    {
        id: 2,
        first_name: 'Bob',
        last_name: 'Smith',
        email: 'bobsmith@gmail.com',
    },
    {
        id: 3,
        first_name: 'Jill',
        last_name: 'Jackson',
        email: 'jilljackson@gmail.com',
    }
]

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Customers',
        users: users
    }); 
});

app.post('/users/add', (req, res) => {
    let newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    }

    console.log(newUser);
});

app.listen(3000, function() {
    console.log('Server started on port 3000...');
})