const express = require('express');
const gravatar = require('gravatar');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const commonUser =require('../model/commonuser');

const User = require('../model/User');
const GoogleUser = require('../model/googleuser');
const validateLoginInput = require('../validation/login');
const validateRegisterInput = require('../validation/register');

const {generateToken,sendToken}= require('../utils/token.utils');
const passport = require('passport');
require('../passport')();

router.get('/:id',function(req,res){
res.send('Received a GET request parram   '+req.params.id);
});

router.post('/login',function(req,res){
    console.log('로긴 시도');
    console.log('들어온 값 : '+JSON.stringify(req.body));
    res.json({
        success:true,
        email:req.body.email,
        password:req.body.password,
        token:'123'
    })
})
router.post('/register',function(req,res){
    console.log('등록시도');
    console.log('들어온 값 : '+JSON.stringify(req.body));
    res.json({
        success:true,
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        password_confirm :req.body.password_confirm
        
    })

})
router.post('/userregister',function(req,res){
    const{errors,isValid}= validateRegisterInput(req.body);
    if(!isValid){
        console.log("에러"+errors);
        console.log("리퀘스트"+req.body);
        return res.status(400).json(errors);
    }
    //기존 User.findOne({
    commonUser.findOne({
        email:req.body.email
    }).then(user=>{
        if(user){
            console.log('ee');
            return res.status(400).json({
                email:'Email already exists'
            });
        }
        else{
           
            const avatar = gravatar.url(req.body.email,{
                s:'200',
                r:'pg',
                d:'mm'
            });
            const newUser = new commonUser({
                name:req.body.name,
                email:req.body.email,
                gemail:null,
                password:req.body.password,
                avatar:avatar,
                googleProvider:null
            });

            bcrypt.genSalt(10,(err,salt)=>{
                console.log('1');
                if(err) console.error('There was an error',err);
                else{
                    console.log('2');
                    bcrypt.hash(newUser.password, salt,(err,hash)=>
                    {
                        console.log('3');
                        if(err) console.error('There was an error',err);
                        else{
                            console.log("maybe success...")
                            newUser.password=hash;
                            newUser
                            .save()
                            .then(user=>{
                                res.json(user)
                            })
                        }
                    })
                }
            })
        }
    })
});
router.post('/userlogin',(req,res)=>{
    const{errors,isValid}=validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    //여기가 클라에서 넘어오는 값
    console.log('초기 비번값');
    console.log(req.body.password);

    commonUser.findOne(email).then(user=>{
        if(!user){
            errors.email='User not found'
            return res.status(404).json(errors);
        }
        bcrypt.compare(password,user.password)
            .then(isMatch=>{
                console.log(user.password);
                if(isMatch){
                    const payload= {
                        is:user.id,
                        name:user.name,
                        avator:user.avatar
                    }
                    jwt.sign(payload,'secret',{
                        expiresIn:3600
                    },(err,token)=>{
                        if(err) console.error('There is some error in token',err);
                        else{
                            res.json({
                                success:true,
                                token:`Bearer ${token}`
                            });
                        }
                    });
                }
                else{
                    errors.password='Incorrect Password';
                    return res.status(400).json(errors);
                }
            })
    });

    // User.findOne({email})
    // .then(user=>{
    //     if(!user){
    //         errors.email='User not found'
    //         return res.status(404).json(errors);
    //     }
    //     bcrypt.compare(password,user.password)
    //         .then(isMatch=>{
    //             console.log(user.password);
    //             if(isMatch){
    //                 const payload= {
    //                     is:user.id,
    //                     name:user.name,
    //                     avator:user.avatar
    //                 }
    //                 jwt.sign(payload,'secret',{
    //                     expiresIn:3600
    //                 },(err,token)=>{
    //                     if(err) console.error('There is some error in token',err);
    //                     else{
    //                         res.json({
    //                             success:true,
    //                             token:`Bearer ${token}`
    //                         });
    //                     }
    //                 });
    //             }
    //             else{
    //                 errors.password='Incorrect Password';
    //                 return res.status(400).json(errors);
    //             }
    //         })
    // })
});
router.route('/googlelogin')
    .post(passport.authenticate('google-token',{session:false}),
    function(req,res,next){
        console.log(req.user);
        console.log('googlelogin실행');
        if(!req.user){
            return res,send(401, '사용자 인증이 되지 않습니다.');
        }
        req.auth={
            id:req.user.id
        };
        next();
    },generateToken,sendToken);

    router.route('/googleregister')
    .post(passport.authenticate('google-token',{session:false}),
    function(req,res,next){
        if(!req.user){
            return res,send(401, '사용자 인증이 되지 않습니다.');
        }
        req.auth={
            id:req.user.id
        };
        next();
    },generateToken,sendToken);
    

router.post('/',function(req,res){
    console.log(JSON.stringify(req.body));
    res.json({
        success:true,
    user:req.body.user,
    ps:req.body.password});
})


router.put('/',function(req,res){
    res.status(400).json({message:'Hey,you Bad Request'});
})
router.delete('/:id',function(req,res){
    res.send('received ad DELET');
})
module.exports = router;