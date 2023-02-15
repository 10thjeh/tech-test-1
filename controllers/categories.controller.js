var express = require('express');
var router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories_create = async (req, res, next) => {
    const body = req.body;
    if(!body.name || body.name.length === 0){
        return res.status(400).json({
            message: "Bad request - Invalid request body"
        })
    }

    try {
        const name = body.name;
        const query = await prisma.course_categories.create({
            data: {
                name
            }
        })

        return res.status(200).json({
            message: "Successfully created new category",
            category: query
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "An error has happened",
            errormsg: error.message
        })
    }
}

const categories_read = async (req, res, next) => {
    try {
        const query = await prisma.course_categories.findMany({});
        return res.status(200).json({
            categories: query
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error has happened",
            errormsg: error.message
        })
    }
}

const categories_update = async (req, res, next) => {
    const body = req.body;
    const id = body.id;
    const name = body.name;
    if(!id || !name || id.length === 0 || name.length === 0){
        return res.status(400).json({
            message: "Bad request - Invalid request body"
        })
    }

    //find the category
    const exist = await prisma.course_categories.findFirst({
        where:{
            id: parseInt(id)
        }
    })

    if(!exist){
        return res.status(401).json({
            message: "Cannot find category with provided ID"
        })
    }

    //update
    try {
        const query = await prisma.course_categories.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name
            }
        })

        return res.status(200).json({
            message: "Successfully updated the category",
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

const categories_delete = async (req, res, next) => {
    const body = req.body;
    const id = body.id;

    if(!id){
        return res.status(400).json({
            message: "Bad request - Invalid request body"
        })
    }

    //find the category
    const exist = await prisma.course_categories.findFirst({
        where:{
            id: parseInt(id)
        }
    })

    if(!exist){
        return res.status(401).json({
            message: "Cannot find category with provided ID"
        })
    }

    //delete

    try {
        const query = await prisma.course_categories.delete({
            where: {
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
    categories_create,
    categories_read,
    categories_update,
    categories_delete,
}