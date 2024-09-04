const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware'); // Ensure correct path
const {createBlogCtrl, likeCtrl, disLikeCtrl, postDetailsCtrl, getAllPostsCtrl }= require('../controllers/blogController');
const singleUpload = require('../middleware/uploadMiddleware');


// create blogs
router.post('/create', authMiddleware, createBlogCtrl);

// like blogs
router.post('/like/:id', authMiddleware, likeCtrl)

// dislike blogs
router.post('/dislike/:id', authMiddleware, disLikeCtrl)

// Route for getting all blogs with pagination
router.get('/posts', getAllPostsCtrl);


// post details
// Route to get post details and increment views
router.get('/posts/:id',  postDetailsCtrl);

module.exports = router;
