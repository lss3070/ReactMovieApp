var express = require('express');
var user = require('./router/user');
var bodyParser= require('body-parser');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./db');
const passport = require('passport');


const mongoose = require('mongoose');

mongoose.connect(config.DB,{useNewUrlParser:true}).then(
    ()=>{console.log('DB 연결 성겅')},
    err=>{console.log('연결 실패 : '+ err)}
);



var app = express();


//googleAccount setting
var corsOption ={
    origin:true,
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,
    exposedHeaders:['x-auth-token']
}
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
//

app.use(passport.initialize());
require('./passport')(passport);

app.use(cors());

app.use('/',express.static('public'));

app.use(bodyParser.json());

//포트지정
app.listen(4000,function(){
    console.log('TEST');
})

app.use('/user',user);