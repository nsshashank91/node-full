const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const profile=new Schema({
    name:String,
    email:String,
    phNum:String,
    country:String
});
module.exports=mongoose.model('profile',profile,'players');