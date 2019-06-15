const express=require('express'); //import express
const bodyParser=require('body-parser');
const api=require('./routes/profileapi');
const passport=require('passport'); 
const cookieParser=require('cookie-parser');
const session=require('express-session');
const cors=require('cors');
const app=express();
app.use(bodyParser.urlencoded({ //to read data from client
    extended:true
}));
app.use(bodyParser.json());
app.use(cors({
    origin:['http://localhost:4200','http://127.0.0.1:4200'],
    credentials:true
}));
app.use(session({
    name:"myname.sid",
    resave:false,
    saveUninitialized:false,
    secret:'secret',
    cookie:{
        maxAge:36000000,
        secure:false
    }
}));
require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());
app.use('/',api);

const port=3000; //these apis are called routes
app.listen(port,function() {
    console.log("server running on port 3000");
});
