const express=require("express");
const User=require('../model/user');
const passport=require('passport');
const router=express.Router();
const mongoose=require('mongoose');
const profileModel=require('../model/profile');
var config = require('./config');
const url="mongodb+srv://kiran:admin@abcd-smeaf.mongodb.net/rcb?retryWrites=true";
mongoose.connect(url,function(eor){
    if(eor) {
        console.log(eor);
    }
    else {
        console.log('connected successfully');
    }
});

function allowOnly(level,req){
    console.log("hello mseg access");
    console.log(level);
    console.log(req.user);
    if(!(level & config.userRoles[req.user.role])) {
        return false;
    }
    else{
        return true;
    }
    
  }
router.post('/register',function(request,response) {
    console.log("inside request");
    let user=new User();
    user.email=request.body.email;
    user.password=User.hashPassword(request.body.password);
    user.role = request.body.role;
    user.save(function(err,data){
        if(err) {
            console.log(err);
            response.send("error registering user");
        }
        else {
            response.json(data);
        }
    });
    
});
router.post('/login',function(request,response,next) {
    console.log("inside login");
    passport.authenticate('local',function(err,user,info) {
        if(err) {
           return response.status(501).json(err);
        }
        if(!user)
        {
            return response.status(501).json(info);
        }
        request.login(user,function(err){
            console.log("inside request login");
            console.log(user);
            if(err)
            {
                console.log(err);
                return response.status(501).json(err);
            }
            return response.status(200).json({message:"login success"});
        });
    })
    (request,response,next);
});
function isValidUser(request,response,next) {
    if(request.isAuthenticated()) next();
    else {
       return response.status(401).json({message:"Unauthorized request"});
    }
}
router.get('/logout',isValidUser,function(request,response,next) {
    request.logout();
    return response.status(200).json({message:"logout success"});
});
router.post('/profile',isValidUser,function(request,response,next) {
    let profile=new profileModel();
    profile.name=request.body.username;
    profile.email=request.body.email;
    profile.phNum=request.body.phone;
    profile.country=request.body.country;
    profile.save(function(eor,data){
        if(eor) {
            response.send('Insert error');
        }
        else {
            response.json(data);
        }
    });
});
router.get('/profile',isValidUser,function(request,response){
    var status = allowOnly(config.accessLevels.user,request);
    if(status){
        profileModel.find({},function(err,profiles){
            if(err) {
                response.send(err);
            }
            else {
                response.json(profiles);
            }
        });
    }
    else{
        return response.status(403).json({message:'Forbidden request'});
    }
    
});
router.get('/profile/:id',function(request,response){
    profileModel.findById(request.params.id,function(err,data){
        if(err){
            response.send(err);
        }
        else {
            response.json(data);
        }
    });
});
router.delete('/profile/:id',function(request,response){
    profileModel.findByIdAndRemove(request.params.id,function(err,data){
        if(err){
            response.send(err);
        }
        else  {
            response.json(data);
        }
    });
});
router.put('/profile/:id',function(request,response){
    profileModel.findByIdAndUpdate(request.params.id,
        {
            $set: {
                name:request.body.username,
                email:request.body.email,
                phNum:request.body.phone,
                country:request.body.country
            }
        },
        {
            new:true
        },
        function(err,data){
            if(err) {
                response.send(err);
            }
            else {
                response.json(data);
            }
        });
});
router.post('/home',function(request,response) {
    let name=request.body.username;
    let email=request.body.email;
    let age=request.body.age;
    let country=request.body.country;
    console.log(request.body.name);
    console.log(request.body.email);
    console.log(request.body.age);
    console.log(request.body.country);
    response.send({"msg":"messgae received"});
});
router.get('/',function(request,response) {
    console.log("yo");
    response.send("no");
});
router.delete('/about',function(request,response) {
    console.log("inside about");
    response.send("this is about response");
});
module.exports=router;