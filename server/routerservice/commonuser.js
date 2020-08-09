
const commonUser =require('../model/commonuser');

commonUserLogin= function(body){
    commonUser.findOne(body.email).then(
        user=>{
            console.log('ee');
        }
    )

}