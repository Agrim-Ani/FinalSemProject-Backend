const asyncHandler = require("express-async-handler")
require('dotenv').config();
const bcrypt = require('bcrypt')
const jwt =  require('jsonwebtoken')
const User = require('../models/userModel')
//@desc register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req,res)=>{
    const {username,email,password} = req.body;
    if(!username||!email||!password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("user already registered")
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id: user.id,email:user.email});
    }else{
        res.status(400);
        throw new Error("User data not valid")
    }
    
});

//@desc login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        res.status(400);
        throw new Error("All fields are mandatory") 
    }
    const user = await User.findOne({email});
    //compare password with hashed passowrd
    if(user!==null){
        const verify_password = await bcrypt.compare(password,user.password);
        if(verify_password){
            const accessToken = jwt.sign({
            user:{
                username: user.username,
                email:user.email,
                id: user.id
            }
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
        res.status(200).json({accessToken})
        }else{
            res.status(401)
            throw new Error("email or password not valid");
        }
    }else{
        res.status(401)
        throw new Error("email or password not valid");
    }
    // res.json({message: "login user"})
});

//@desc current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user);
});

module.exports = {registerUser,loginUser,currentUser};