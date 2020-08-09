'use strict';
require('./model/googleuser')();
const passport =require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT= require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');

//구글 계정
const GoogleUser = mongoose.model('GoogleUser');
const commonusers = mongoose.model('commonusers');

const GoogleTokenStrategy = require('passport-google-token').Strategy;
let config = require('./config');

//일반 사용자 계정
const opts ={};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();//여기서 서버에서 클라이언트로 사용자 정보 전달
opts.secretOrKey = 'secret';

module.exports = function(){

    //일반로그인
    passport.use(new JWTStrategy(opts,(jwt_payload,done)=>{
        User.findById(jwt_payload.id)
        .then(user=>{
            if(user){
                return done(null,user);
            }
            return done(null,false);
        })
        .catch(err=>console.error(err));
    }));
    //일반 로그인 수정후
    // passport.use(new JWTStrategy(opts,function(jwt_payload,done){
    //     console.log(jwt_payload,done);

    //     User.u
    // }));

    //구글 계정로그인
    passport.use(new GoogleTokenStrategy({
        clientID:config.googleAuth.clientID,
        clientSecret:config.googleAuth.clientSecret
    },
    function(accessToken,refreshToken,profile,done){
        console.log('google account순서 accesstoken,refreshtoken,profile,done')
        //accessToken 암호화된 text
        //refreshToken i dont know
        //profile provider,id,displayname,email,등등드으드ㅡ읃으 google계정에서 가져오는 정보
        //done [Function: verified] 이거 나옴 정확하게 모르겠음...
 
        commonusers.upsertGoogleUser(accessToken,refreshToken,profile,function(err,user){
            return done(err,user);
        });
    }));
}