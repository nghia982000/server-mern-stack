const Post = require('../models/Post')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const { findOneAndUpdate } = require('../models/Post')
class PostController {

    async listPost(req, res, next) {
        try {
            Post.find({})
                .then(data => {
                    res.json({ success: true, data })
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async getPost(req, res) {
        try {
            const posts = await Post.find({ user: req.userId })
            res.json({ success: true, posts })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }

    async addPost(req, res) {
        const { title, description, urlDemo,image, urlSource} = req.body
        if (!title) {
            return res.status(400).json({
                message: 'Title is required',
                success: false
            })
        }
        try {
            const newPost = new Post({
                title,
                description,
                image,
                urlDemo: urlDemo.startsWith('https://') ? urlDemo : `https://${urlDemo}`,
                urlSource: urlSource.startsWith('https://') ? urlSource : `https://${urlSource}`,
                user:req.userId
            })
            await newPost.save()
            res.json({
                success: true,
                message: 'Successfully!!!',
                post: newPost
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
    async updatePost(req, res) {
        const { title, description, urlDemo,image, urlSource}= req.body
        if (!title) {
            return res.status(400).json({
                message: 'Title is required',
                success: false
            })
        }
        try {
            let updatePost = {
                title,
                description,
                image,
                urlDemo: urlDemo.startsWith('https://') ? urlDemo : `https://${urlDemo}`,
                urlSource: urlSource.startsWith('https://') ? urlSource : `https://${urlSource}`
            }
            const postUpdateCondition = {
                _id: req.params.id,
                user: req.userId
            }
            updatePost = await Post.findOneAndUpdate(
                postUpdateCondition,
                updatePost,
                { new: true }
            )
            //User not authorised to update post or post not found
            if (!updatePost) {
                return res.status(401).json({
                    success: false,
                    message: 'Post not found or user not authorised '
                })
            }
            res.json({
                success: true,
                message: 'Excellent progress',
                post: updatePost
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
    async deletePost(req, res) {
        try {
            const postDeleteCondition = {
                _id: req.params.id,
                user: req.userId
            }
            const deletedPost = await Post.findOneAndDelete(postDeleteCondition)
            //User not authorised to update post or post not found
            if (!deletedPost) {
                return res.status(401).json({
                    success: false,
                    message: 'Post not found or user not authorised '
                })
            }
            res.json({
                success: true,
                post: deletedPost
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
}

module.exports = new PostController()