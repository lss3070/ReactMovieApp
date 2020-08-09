const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// 입력될 데이터의 타입이 정의된 DB 설계도 
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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
UserSchema.set('toJSON',{getters:true,virtuals:true});
UserSchema.static.upsertGoogleUser = function(accessToken,
    refreshToken,profile,cb){
        console.log('일반계정로그인시!!')
        console.log(accessToken);
        console.log(profile);
        console.log(cb);
        var that = this;
        return this.findOne({
            'googleProvider.id':profile.id
        },function(err,user){
            if(!user){
                let newUser = new that({
                    fullName:profile.displayName,
                    email:profile.emails[0].value,
                    googleProvider:{
                        id:profile.id,
                        token:accessToken
                    }
                });
                newUser.save(function(error,savedUser){
                    if(error){
                        console.log(error);
                    }
                    return cb(error,savedUser);
                });
            }else {
                return cb(err,user);
            }
        })
    }
    UserSchema.static.sampletest =function(test){

    }
//정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일
const User = mongoose.model('users', UserSchema);

module.exports = User;
//temp