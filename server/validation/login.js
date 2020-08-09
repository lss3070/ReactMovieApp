const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports= function validateLoginInput(data){
    let errors ={};
    data.email = !isEmpty(data.email)? data.email:'';
    data.password =!isEmpty(data.password)? data.password:'';

    if(!Validator.isEmail(data.email)){
        console.log('email1');
        errors.email ='Email is invalid';
    }
    if(Validator.isEmpty(data.email)){
        console.log('email2');
        errors.email = 'Email is required';
    }
    if(!Validator.isLength(data.password,{min:6,max:30})){
        console.log('paaword1');
        error.password='password must have 6 chards';
    }
    if(Validator.isEmpty(data.password)){
        console.log('password2');
        errors.password='Password is required';
    }

    return{
        errors,
        isValid:isEmpty(errors)
    }
}