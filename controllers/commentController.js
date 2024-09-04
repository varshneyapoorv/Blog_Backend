// controllers/commentController.js
const Blog = require('../models/blogModel.js');
const Category = require('../models/categoryModel.js');
const Comment = require('../models/commentModel.js');
const User = require("../models/userModel.js")

// Add a comment to a blog
const createCommentCtrl  = async (req, res) => {
  const{description}= req.body;
  const userId = req.params.id || (req.user && req.user.id);
  console.log('User ID:', userId);
  const postId = req.params.postId;
  console.log('Post ID:', postId);
  try {
    // find the post
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).send({
        success: false,
        message: 'Post not found'
      });
    }
    // create comment
    const comment = await Comment.create({
      post : post._id,
      description,
      user: userId
    })
    // push the comment to post
    post.comments = post.comments || []; 
    post.comments.push(comment._id);
    // find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
    // push to user
    user.comments = user.comments || [];
    user.comments.push(comment._id);
    // save
    // disable validation
    await post.save({validationBeforeSave: false});
    await user.save();
    // Count the total number of comments
    const totalComments = post.comments.length;

    res.status(201).send({
      success: true,
      data: comment,
      totalComments: totalComments 
    });
  } catch (error) {
    res.status(500).send({
      success : false,
      message : error.message
    });
  }
};

// update
const updateCommentCtrl = async(req,res)=>{
  const {description} = req.body;
  const userId = req.params.id || (req.user && req.user.id);
  try{
    const post = await Comment.findById(req.params.id);
    
    const category = await Comment.findByIdAndUpdate(req.params.id, {title}, {new: true, runValidators:true});
    res.json({
      status : "success",
      data : category
    });
  }catch (error) {
    res.status(500).send({
      success : false,
      message : error.message
    });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    await Comment.findByIdAndDelete(commentId);

    const blog = await Blog.findById(blogId);
    blog.comments = blog.comments.filter(id => id.toString() !== commentId);
    await blog.save();

    res.send('Comment deleted');
  } catch (error) {
    res.status(500).send({
      success:false,
      message : error.message
    });
  }
};
// delete comment
const deleteCommentCtrl = async(req,res)=>{
  try{
    // find the comment
    const comment = await Comment.findById(req.params.id);
    await Comment.findByIdAndDelete(req.params.id);
    res.json({
      status : "success",
      data : "delete comment route",
    })
  }catch (error) {
    res.status(500).send({
      success : false,
      message : error.message
    });
  }
}

module.exports = {
  createCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
}