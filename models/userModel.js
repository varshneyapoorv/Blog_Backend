const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const Schema = mongoose.Schema;
const postModel = require("../models/blogModel")

// Define the author schema
const userSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  profilePic:{
    public_id : {
        type : String,
    },
    url : {
        type : String,
    }
},
// answer:{
//     type:String,
//     required:[true, "answer is required"]
// },
// isBlocked: {
//   type: Boolean,
//   default: false,
// },
isAdmin: {
  type: Boolean,
  default: false,
},
// viewedBy: [{
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User"
// }],
// followers: [{
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User"
// }],
// following: [{
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User"
// }],
posts: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Post"
}],
comments: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Comment",
  default: []
}],
role: {
  type: String,
  enum: ['user', 'admin', 'guest'],
  default: 'user',
},
viewedBy: [{
  // type : mongoose.Schema.Types.ObjectId,
  type : Number,
  ref : "User",
}]
}, { 
  timestamps: true,
  // to get the virtuals in json response from server
  toJSON : { virtuals:true}, 
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash the password if it's been modified
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for authentication
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// jwt token
userSchema.methods.generateToken = function(){
  return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '6d'})
}

// Virtual property for post count
userSchema.virtual('postCounts').get(function() {
  return this.posts.length;
});

// hooks
userSchema.pre('findOne', async function(next){
  // populate the post
  this.populate('posts');
  // get the user id
  // const userId = this._condition._id;
  const userId = this.getQuery()._id;
  // find the post created by the user
  const posts = await postModel.find({user: userId})
  // get the last post created by the user
  const lastPost = posts[posts.length-1]

  // get the last post date
  const lastPostDate = new Date(lastPost && lastPost.createdAt);
  // get the last post date in string format
  const lastPostDateStr = lastPostDate.toDateString();
  // add virtuals to the schema
  userSchema.virtual('lastPostDate').get(function(){
    return lastPostDateStr;
  })
  // console.log(lastPostDateStr);
  
  next()
})
// post - after saving
userSchema.post("save", function(next){
  console.log("Post Hook")
})

const User = mongoose.model('User', userSchema);
module.exports = User;
