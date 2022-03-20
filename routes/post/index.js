const express = require('express')
const router = express.Router()
const postController = require('../../controller/postController')
const verifyToken=require('../../middleware/auth')

router.post('/addPost', verifyToken, postController.addPost)
router.get('/getPost', verifyToken, postController.getPost)
router.get('/listPost', postController.listPost)
router.put('/updatePost/:id', verifyToken, postController.updatePost)
router.delete('/deletePost/:id', verifyToken, postController.deletePost)



module.exports = router