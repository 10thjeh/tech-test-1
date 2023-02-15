var express = require('express');
var router = express.Router();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const validateCreate = (body) => {
    return Object.keys(body).length === 0
           || !body.users_id
           || !body.course_id
           || body.users_id.length === 0
           || body.course_id.length === 0
}

const validateUpdate = (body) => {
    return Object.keys(body).length === 0
           || !body.id
           || !body.users_id
           || !body.course_id
           || body.id === 0
           || body.users_id.length === 0
           || body.course_id.length === 0
}

const user_courses_create = async (req, res, next) => {
    const body = req.body;
    if(validateCreate(body)){
        return res.status(400).json({
            message: "Bad request - Invalid body response"
        })
    }

    const users_id = parseInt(body.users_id);
    const course_id = parseInt(body.course_id);

    try {
        const query = await prisma.user_courses.create({
            data: {
                users: {
                    connect:{
                        id: users_id
                    }
                },
                course:{
                    connect:{
                        id: course_id
                    }
                }
            }
        })
        return res.status(200).json({
            message: "User_course created successfully!",
            user_courses: query
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        })
    }
}

const user_courses_read = async (req, res, next) => {
    try{
        const query = await prisma.user_courses.findMany({})
        return res.status(200).json({
            user_courses: query
        });
    }
    catch(err){
        return res.status(500).json({
            message: "An error has happened",
            errormsg: err.message,
        })
    }
}

const user_courses_update = async (req, res, next) => {
    const body = req.body;

    if(validateUpdate(body)){
        return res.status(400).json({
            message: "Bad request - Invalid body response"
        })
    }

    const id = parseInt(body.id);
    //check if user_course exist
    const exist = await prisma.user_courses.findFirst({
        where: {
            id
        }
    })

    if(!exist){
        return res.status(401).json({
            message: "Cannot find user_course"
        })
    }
    
    const users_id = parseInt(body.users_id);
    const course_id = parseInt(body.course_id);

    //update
    try {
        const query = await prisma.user_courses.update({
            where: {
                id
            },
            data: {
                users: {
                    connect:{
                        id: users_id
                    }
                },
                course: {
                    connect: {
                        id: course_id
                    }
                }
            }
        });
        return res.status(200).json({
            message: "Successfully updated user_course",
            user_course: query
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errormsg: error.meta.cause
        })
    }
}

const user_courses_delete = async (req, res, next) => {
    const id = req.body.id;
    if(!id){
        return res.status(400).json({
            message: "Bad request - Please provide id"
        })
    }

    //Find user_course to delete
    const exist = await prisma.user_courses.findFirst({
        where:{
            id: parseInt(id)
        }
    })

    if(!exist){
        return res.status(401).json({
            message: "Cannot find user_courses with provided ID"
        })
    }

    //delete
    try {
        const query = await prisma.user_courses.delete({
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
    user_courses_create,
    user_courses_read,
    user_courses_update,
    user_courses_delete,
}