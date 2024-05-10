const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true,"Please add the user name"]
    },
    email:{
        type: String,
        required: [true,"Please add the user email id"],
        uninque: [true,"email address already taken"]
    },
    password:{
        type: String,
        required: [true,"Please add the user password"]
    },
    isEmailConfirmed: { 
        type: Boolean, 
        default: false 
    },
    emailConfirmationToken: { 
        type: String, 
        default: '' 
    }
},{
    timestamps: true
});

module.exports = mongoose.model("User",userSchema);