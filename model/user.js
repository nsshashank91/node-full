var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema= mongoose.Schema;

var schema = new Schema({
    email: {type: String},
    password: {type: String},
    role: {type: String}
});


schema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

schema.methods.isValid = function(hashedPassword){
    return bcrypt.compareSync(hashedPassword,this.password);
}

module.exports = mongoose.model('user',schema,'users');