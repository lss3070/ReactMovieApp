
const jwt= require('jsonwebtoken');
let createToken = function(auth){
    const payload= {
        is:auth.id,
        name:auth.name
    }
    return jwt.sign(payload,
    //기존 my-secret로 되어있던거 secret임의로 변경
    'secret',
    {
        expiresIn:60 * 120
    });
};


module.exports={
    generateToken:function(req,res,next){
        req.token = createToken(req.auth);
        return next();
    },
    sendToken:function(req,res){
        //변경방식
        res.setHeader('x-auth-token',req.token);
        return res.status(200).send(JSON.stringify(req.user));
        //기존 googleaccount에서 토큰 전송방식
        // res.setHeader('x-auth-token',req.token);
        // return res.status(200).send(JSON.stringify(req.user));
    }
}