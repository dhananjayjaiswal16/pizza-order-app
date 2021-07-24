require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');


//database-connect
const url = "mongodb://localhost:27017/pizza"
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("database connected...");
}).catch(err => {
    console.log("Connection failed...");
})


// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: "mongodb://localhost:27017/pizza"
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // cookie-expiry-time: 24 hour
}));


//passport
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());



app.use(flash());
app.use(express.urlencoded({extended: false}))
app.use(express.json());



//global middleware for sessions
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});



//Static Files
app.use(express.static('public'));

//set template engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');




//Routes
require('./routes/web.js')(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});