var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

//create admin

const validateRegister = (body) => {
    return Object.keys(body).length === 0 
           || !body.name 
           || !body.email 
           || !body.password
           || body.name.length === 0
           || body.email.length === 0
           || body.password.length === 0;
}

const validateLogin = (body) => {
    return !body.email
           ||!body.password
           ||body.email.length === 0
           ||body.password.length === 0
}

const admin_register = (req, res, next) => {
    console.log("Admin_Register");
    const body = req.body;

    if(validateRegister(body)){
        res.status(400).json({
            message: "Bad request - Invalid body response"
        })
        return
    }

    const name = body.name;
    const email = body.email;
    const password = body.password;

    bcrypt.hash(password, 3, async function(err, hash) {
        
        try {
            const query = await prisma.admin.create({
                data:{
                    name,
                    email,
                    password: hash
                }
            })
    
            res.status(200).json({
                message: "Success!",
                user: {
                    name: name,
                    email: email,
                    password: hash
                }
            })
        } catch (error) {
            return res.status(500).json({
                errormsg: error.message
            })
        }
    });
}

const admin_login = async (req, res, next) => {
    console.log("Admin_login");
    console.log(req.body)
    if(validateLogin(req.body)){
        res.status(400).json({
            message: "Bad request - Invalid body response"
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    
    //get the admin first (via e-mail)
    const user = await prisma.admin.findFirst({
        where:{
            email
        }
    })

    //If we cant find the admin, return here
    if(!user){
        res.status(401).json({
            message: "Cannot find user"
        })
        return
    }
    const jwt_credentials = {
        name: user.name,
        email: email,
    }
    //User exists and inputs are valid
    bcrypt.compare(password, user.password, (err, result) => {
        if(err) {
            console.log("Error: " + err.message)
            return res.status(500).json({
                errormsg: err.message
            })
        }
        if(!result){
            return res.status(401).json({
                message: "Wrong password!"
            })
        }

        const token = jwt.sign(jwt_credentials, process.env.JWT_SECRET, (err, token) => {
            return res.status(200).json({
                message: "Login success!",
                email: email,
                token: token
            })
        })
        
    })


}

//exports

module.exports = {
    admin_register,
    admin_login,
}