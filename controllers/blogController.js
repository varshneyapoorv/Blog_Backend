const blogModel = require('../models/blogModel.js');
const userModel = require('../models/userModel.js')
const {response} = require("express")
const cloudinary= require("cloudinary").v2;
const {getDataUri} = require("../utils/features.js");
const Post = require('../models/blogModel.js');

// create the blog
const createBlogCtrl = async (req,res) =>{
  const {title,description,category} = req.body;
  try{
    // find the user
    const userId = req.params.id || req.user._id; // Adjust based on your routes
      const user = await userModel.findById(userId)
    // create the post
    const postCreated = await Post.create({
      title,
      description,
      user: user._id,
      category
    })
    // associate user to the post - push the post into the user posts field
    user.posts.push(postCreated);
    // save
    await user.save();
    res.json({
      success: true,
      message: "Post Created",
      data : postCreated
    })
  }catch(error){
    res.json(error.message);
  }
}

// get all blogg
const getAllPostsCtrl = async (req, res) => {
  try {
    // Get page and limit from query parameters with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Find all blogs with pagination
    const posts = await blogModel.find({})
      .populate('user')
      .populate('category', 'title')
      .skip(skip)
      .limit(limit);

    // Get the total number of documents
    const total = await blogModel.countDocuments({});

    res.status(200).send({
      success: true,
      message: "All posts fetched successfully",
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// like controller
const likeCtrl = async(req,res)=>{
  const userId = req.params.id || req.user._id;
  try{
    // get the post
  const post = await blogModel.findById(req.params.id);
  //check if the user already like the post
  const isLiked = post.likes.includes(userId);
  // if the user has already liked the post, unlike the post
  if (isLiked) {
    // If the user has already liked the post, unlike the post
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      post,
      likesCount: post.likes.length
    });
  } else {
    // If the user has not liked the post, like the post
    post.likes.push(userId);
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      post,
      likesCount: post.likes.length
    });
  }
}catch (error) {
    console.error("Error in likeCtrl:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// dislike controller
const disLikeCtrl = async(req,res)=>{
  const userId = req.params.id || req.user._id;
  try{
    // get the post
  const post = await blogModel.findById(req.params.id);
  //check if the user already unlike the post
  const isUnLiked = post.disLikes.includes(userId);
  // if the user has already liked the post, unlike the post
  if (isUnLiked) {
    // If the user has already liked the post, unlike the post
    post.disLikes = post.disLikes.filter(id => id.toString() !== userId.toString());
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Post undisiked successfully",
      post,
      dislikesCount: post.disLikes.length
    });
  } else {
    // If the user has not liked the post, like the post
    post.disLikes.push(userId);
    await post.save();
    return res.status(200).json({
      success: true,
      message: "Post Disliked successfully",
      post,
      dislikesCount: post.disLikes.length
    });
  }
}catch (error) {
    console.error("Error in likeCtrl:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}


// post details
const postDetailsCtrl = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user ? req.user._id : null;
    const guestId = req.ip; 
    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Initialize numViews and guestViews if undefined
    post.numViews = post.numViews || [];
    post.guestViews = post.guestViews || [];

    let isViewed = false;

    // Check if the user is registered
    if (userId) {
      // Check if user has viewed this post
      isViewed = post.numViews.some(view => view.equals(userId));
      if (!isViewed) {
        // Push the user into numViews
        post.numViews.push(userId);
      }
    } else {
      // Handle guest users
      isViewed = post.guestViews.includes(guestId);
      if (!isViewed) {
        // Push the guest ID into guestViews
        post.guestViews.push(guestId);
      }
    }

    // Save the post only if it was not viewed before
    if (!isViewed) {
      await post.save();
    }

    res.status(201).json({
      success: true,
      message: "Post details fetched successfully",
      viewsCount: post.numViews.length + post.guestViews.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};


module.exports = {
  createBlogCtrl,
  getAllPostsCtrl,
  likeCtrl,
  disLikeCtrl,
  postDetailsCtrl,
}