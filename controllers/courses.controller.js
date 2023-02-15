var express = require('express');
var router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validateCreate = (body) => {
    return Object.keys(body).length === 0
           || !body.title
           || !body.course_category_id
           || body.title.length === 0
           || body.course_category_id.length === 0;
}

const validateUpdate = (body) => {
    return Object.keys(body).length === 0
           || !body.id
           || !body.title
           || !body.course_category_id
           || body.id.length === 0
           || body.title.length === 0
           || body.course_category_id.length === 0;
}

const course_create = async (req, res, next) => {
    const body = req.body;
    if(validateCreate(body)){
        return res.status(400).json({
            message: "Bad request - Invalid body response"
        })
    }

    try {
        const title = body.title;
        const course_category_id = parseInt(body.course_category_id);
        const query = await prisma.courses.create({
            data:{
                title,
                course: {
                    connect: {
                        id: course_category_id
                    }
                }
            }
        })
        return res.status(200).json({
            message: "Success!",
            course: query
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errormsg: error.meta.cause
        })
    }
}

const course_read = async (req, res, next) => {
    try {
        const query = await prisma.courses.findMany({});
        return res.status(200).json({
            course: query
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error has happened",
            errormsg: error.message
        })
    }
}

const course_update = async (req, res, next) => {
    const body = req.body;
    if(validateUpdate(body)){
        return res.status(400).json({
            message: "Bad request - Invalid request body"
        })
    }

    //find the course
    const id = body.id;
    const exist = await prisma.courses.findFirst({
        where:{
            id: parseInt(id)
        }
    })

    if(!exist){
        return res.status(401).json({
            message: "Cannot find course with provided ID"
        })
    }
    const title = body.title;
    const course_category_id = parseInt(body.course_category_id);
    //update the course
    try {
        const query = await prisma.courses.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title,
                course: {
                    connect: {
                        id: course_category_id
                    }
                }
            }
        })

        return res.status(200).json({
            message: "Successfully updated the course",
            category: query
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "An error has happened",
            errormsg: error.message
        })
    }
}

const course_delete = async (req, res, next) => {
    const id = req.body.id;
    if(!id){
        return res.status(400).json({
            message: "Bad request - Invalid request body"
        })
    }

    //find the course
    const exist = await prisma.courses.findFirst({
        where:{
            id: parseInt(id)
        }
    })

    if(!exist){
        return res.status(401).json({
            message: "Cannot find course with provided ID"
        })
    }

    //delete the course
    try {
        const query = await prisma.courses.delete({
            where:{
                id: parseInt(id)
            }
        })
        return res.status(200).json({
            message: "Successfully deleted the category",
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message: "An error has happened",
            errormsg: error.message
        })
    }
}


module.exports = {
    course_create,
    course_read,
    course_update,
    course_delete,
}