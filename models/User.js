const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    userName: {
      type: String,
      require: true,
      index: {unique:true}
    },
    password: {
        type: String,
        required: true
    },
    faceID: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    }
});

UserSchema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

UserSchema.methods.isValid = function isValid(hashedpassword){
    return bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model("Users", UserSchema);