const {getDataUri} = require('../utils/features')
const cloudinary = require("cloudinary").v2;
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Post = require('../models/blogModel');
// const config = require('../config');

// Register a new author
const registerController = async (req, res) => {
  try {
    const { name, email, password, isAdmin} = req.body;
    // const file = req.file;
    // const file = getDataUri(req.file);
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if author already exists
    const existingUser = await userModel.findOne({ email });
    // validation
    if (existingUser) {
      return res.status(400).send({
        success:false,
        message: 'user already exists' });
    }
    // Create new author

        // Upload product image to Cloudinary
// const result = await cloudinary.uploader.upload(file.content, {
//             folder: 'product_pics'
//         });
const user = await userModel.create({
      name, email, password, isAdmin,
      // profilePic: {
      //   url: result.secure_url,
      //   public_id: result.public_id
      // }
    });
    await user.save();

  const token = user.generateToken();

  res.status(201)
  .cookie("token", token, {    
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),  
    secure: process.env.NODE_ENV !== "development",
    httpOnly: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV !== "development",
  })
  .json({ success: true, message: 'Registered successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }

};

// Login an author
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).send({ 
        success:false,
        message: 'Email and password are required' });
    }
    
    const user = await userModel.findOne({ email });
    
    if (!user || !await user.comparePassword(password)) {
      return res.status(400).send({ 
        success:false,
        message: 'Invalid credentials' });
    }
    const token = user.generateToken();
    res.status(200)
        .cookie("token", token,{    
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),  
            secure: process.env.NODE_ENV !== "development",
                httpOnly: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV !== "development",
        })
      .json({ success: true, message: "Login Successfully", token, user: user });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: err.message });
    } else {
      console.error('Error occurred after headers sent:', err);
    }
  }
};

// logout
const logoutController = async(req,res)=>{
  try{
      res.status(200).cookie("token", "", {    
          expires: new Date(Date.now()),  
          secure: process.env.NODE_ENV !== "development",
          httpOnly: process.env.NODE_ENV !== "development",
          sameSite: process.env.NODE_ENV !== "development",
      }).send({
          success: true,
          message: "logout successfully"
      })
  }catch(error){
      console.error(error);
      res.status(500).send({
          success: false,
          message : "error in logout api",
          error
      })
  }
};

// get user profile
const getUserProfileController = async(req,res)=>{
  try{
      // const user = await userModel.findById(req.user._id);
      const userId = req.params.id || req.user._id; // Adjust based on your routes
      const user = await userModel.findById(userId)
      // validation
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).send({
        success: true,
        message: 'User profile fetched successfully',
        user: {
          ...user.toObject(), 
          postCounts: user.postCounts, 
        },
      });
  }catch(error){
      console.error(error);
      res.status(500).send({
          success: false,
          message : "error in profile api",
          error
      })
  }

}

// who viewed my profile
const whoViewedProfileController = async(req,res)=>{
    try{
    const viewedUserId = req.params.id; 
    const viewerUserId = req.user._id; 
      // find the original
      const user = await userModel.findById(viewedUserId );
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    if (!user.viewedBy.includes(viewerUserId)) {
      user.viewedBy.push(viewerUserId);
      await user.save();
    }
     // Find all users who have viewed the profile
     const viewers = await userModel.find({ _id: { $in: user.viewedBy } });
      res.json({
        success : true,
        message: "Profile viewers fetched successfully",
        viewers
      })
    }catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error fetching profile viewers",
        error: error.message
      });
    }
}

// upadte password
const updatePasswordController = async(req,res)=>{
  try{
      const user = await userModel.findById(req.user._id);
      const {oldPassword, newPassword} = req.body;
      // validation
      if(!oldPassword || !newPassword){
        return res.status(500).send({
          success:false,
          message: "Please provide old or new password"
        });
      }
      const isMatch = await user.comparePassword(oldPassword)
      // validation
      if(!isMatch){
        return res.status(500).send({
          success:false,
          message:"invalid old password"
        })
      }
      user.password= newPassword;
      await user.save();
      res.status(200).send({
        success : true,
        message : "Password Updated Successfully"
      });
  }catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update password API",
      error,
    });
  }
};

// update user profile controller
const updateProfileController = async(req,res)=>{
  try{
    const user = await userModel.findById(req.user._id)
    const {name, email,password,profilePic, isAdmin} = req.body;
    // validation + update
    if(name) user.name = name;
    if(email) user.email = email;
    if(password) user.password = password;
    if(profilePic) user.profilePic = profilePic;
    if (typeof isAdmin !== 'undefined') user.isAdmin = isAdmin;
    await user.save()
  }catch(error){
    console.error(error);
    res.status(500).send({
        success: false,
        message : "error in logout api",
        error :error.message
    })
}
}
// delete account
const deleteAccountCtrl = async(req,res)=>{
  try{
    // find the user for deletion
    const userId = req.params.id || req.user._id;
    const userTodelete = await userModel.findById(userId);
    //find all post to be deleted
    await Post.deleteMany({user: userId});
    await userTodelete.deleteOne();
    res.status(201).send({
      success:true,
      message: "user delete successfully",
    })
  }catch(error){

    res.json({
      success:false,
      message: error.message
    })
  }
}

// update author profile photo
const updateProfilePicController = async (req,res) =>{
  try{
    if(!req.file){
      return res.status(400).json({
        success : false,
        message : "No file uploaded"
      })
    }
    const file = getDataUri(req.file);
    const user = await userModel.findById(req.user.id);
    // check if user exists
    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found"
      })
    }
    // delete the previous profile picture if exists
    if(user.profilePic && user.profilePic.public_id){
      await cloudinary.uploader.destroy(user.profilePic.public_id);
      // upload new profile picture
      const result = await cloudinary.uploader.upload(file.content,{
        folder:'profile_blog_pics'
      })
    }
    // update the user profile pic url and public_id
    user.profilePic = {
      url: result.secure_url,
      public_id: result.public_id
    }
    await user.save();
    res.status(200).json({
      success:true,
      message : "Profile picture updated successfully",
      url: result.secure_url
    });
  }catch (error) {
    console.error(error);
    res.status(500).json({
        success: false,
        message: 'Error updating profile picture',
        error: error.message
    });
}
};

// forgot password
const forgotPasswordController = async(req,res)=>{
  try{
      // user egt email || new password || author
      const {email, newPassword, answer} = req.body;
      // validation
      if(!email || !newPassword || !answer){
        return res.status(500).send({
            success:false,
            message:"Please proide all fields",
            error: error.message
          })
      }
      // find user
      const user = await userModel.findOne({email,answer})
      // validation
      if(!user){
        return res.status(404).send({
          success:false,
          message:"invalid user or answer",
          error:error.message
        })
      }
      // change password
      user.password = newPassword;
      await user.save()
      res.status(200).send({
        success:true,
        message: "your password has been reset please login again"
      })
  }catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error in reseting the password',
            error: error.message
        });
    }
}


module.exports = {
  registerController,
  loginController,
  logoutController,
  updatePasswordController,
  getUserProfileController,
  updateProfileController,
  updateProfilePicController,
  forgotPasswordController,
  whoViewedProfileController,
  deleteAccountCtrl,
}