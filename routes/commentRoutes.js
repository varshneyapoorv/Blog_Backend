const express = require('express');
const router = express.Router();
const { createCommentCtrl, updateCommentCtrl, deleteCommentCtrl } = require('../controllers/commentController');
// const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware'); 

// Route definition
router.post('/posts/:id/comments', authMiddleware, createCommentCtrl);

// update the comment
router.put('/post/:id/update-comment', authMiddleware, updateCommentCtrl),

// delete the comment
router.delete("/posts/:id/delete-comment", authMiddleware, deleteCommentCtrl)



module.exports = router;
