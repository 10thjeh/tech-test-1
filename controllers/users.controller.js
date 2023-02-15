var express = require('express');
var router = express.Router();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const validateRegister = (body) => {
    return Object.keys(body).length === 0 
           || !body.name 
           || !body.email 
           || !body.password
           || body.name.length === 0
           || body.email.length === 0
           || body.password.length === 0;
}

const validateUpdate = (body) => {
    return Object.keys(body).length === 0 
           || !body.name 
           || !body.email 
           || !body.password
           || !body.id
           || body.name.length === 0
           || body.email.length === 0
           || body.password.length === 0
           || body.id.length === 0;
}

const users_create = (req, res, next) => {
    console.log("users_create");
    const body = req.body;
    console.log(body)
    if(validateRegister(body)){
        return res.status(400).json({
            message: "Bad request - Invalid body response"
        })
    }

    const name = body.name;
    const email = body.email;
    const password = body.password;

    bcrypt.hash(password, 2, async (err, hash) => {
        try {
            const query = await prisma.users.create({
                data:{
                    name,
                    email,
                    password: hash
                }
            })
            
            return res.status(200).json({
                message: "User created successfully!",
                user: {
                    name,
                    email,
                    password: hash
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    })
}

const users_read = async (req, res, next) => {
    try{
        const query = await prisma.users.findMany({})
        return res.status(200).json({
            users: query
        });
    }
    catch(err){
        return res.status(500).json({
            message: "An error has happened",
            errormsg: err.message,
        })
    }
    
}

const users_update = async (req, res, next) => {
    const body = req.body;
    
    if(validateUpdate(body)){
        return res.status(400).json({
            message: "Bad request - Invalid body response"
        })
    }

    const id = body.id;
    const name = body.name;
    const email = body.email;
    const password = body.password;

    //Check if user exists
    const exist = await prisma.users.findFirst({
        where: {
            id: parseInt(id)
        }
    })

    if(!exist){
        return res.status(401).json({
            message: "Cannot find user"
        })
    }

    //User exist, proceed to update record
    
    try{
        bcrypt.hash(password, 2, async (err, hash) => {
            const query = await prisma.users.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name,
                    email,
                    password: hash,
                }
            })
    
            return res.status(200).json({
                message: "Successfully updated user data",
                user: query
            })
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "An error has happened",
            errormsg: err.message
        })
    }
}


const users_delete = async (req, res, next) => {
    const id = req.body.id;
    if(!id){
        return res.status(400).json({
            message: "Bad request - Please provide id"
        })
    }

    //Find user to delete
    const exist = await prisma.users.findFirst({
        where:{
            id: parseInt(id)
        }
    })

    if(!exist){
        return res.status(401).json({
            message: "Cannot find user with provided ID"
        })
    }

    //Delete the user
    try {
        const query = await prisma.users.delete({
            where:{
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "Successfully deleted"
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error happened",
            errormsg: error.message
        })
    }
}


module.exports = {
    users_create,
    users_read,
    users_update,
    users_delete,
}