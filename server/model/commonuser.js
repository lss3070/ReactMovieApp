'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');


const Schema = mongoose.Schema;
var dblink = require('../db');

    let db = mongoose.connect(dblink.GOOGLEDBACCOUNT);//main.js 로 뺴고

    const CommonUserSchema = new Schema({
        name:{
            type:String
        },
        email: {
            type: String
            // required: true
        },
        gemail:{
            type: String,
            trim: true, unique: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        }, 
        password: {
            type: String
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        },
        googleProvider:{
            type:{
                id:String,
                token:String
            },
            select:false
        }
    });
    CommonUserSchema.set('toJSON', {getters: true, virtuals: true});

//구글 로그인시
    CommonUserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
        var that = this;
        return this.findOne({
            'googleProvider.id': profile.id
        }, function(err, user) {
            // no user was found, lets create a new one
            if (!user) {
                let avatar = gravatar.url(profile.emails[0].value,{
                    s:'200',
                    r:'pg',
                    d:'mm'
                });
                var newUser = new that({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleProvider: {
                        id: profile.id,
                        token: accessToken
                    },
                    avatar:avatar
                });

                newUser.save(function(error, savedUser) {
                    if (error) {
                        console.log(error);
                    }
                    return cb(error, savedUser);
                });
            } else {
                return cb(err, user);
            }
        });
    };
    
    const CommonUser = mongoose.model('commonusers',CommonUserSchema);

    module.exports= CommonUser;
