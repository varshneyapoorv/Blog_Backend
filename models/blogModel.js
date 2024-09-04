const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
  title:{
      type:String,
      required :[true, 'Post title is required'],
      trim: true
  },
  description:{
      type: String,
      required:[true, "Post description is required"]
  },
  category:{
      type: mongoose.Schema.ObjectId,
      ref:"Category",
      required:[true,"Post catrgory is required"],
  },
  numViews: [{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    default: [] 
  }],
  guestViews: [{
    type: String,
    default: []
  }],
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    default: []
  }],
  disLikes: [{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    default: []
  }],
  comments: [{
    type: mongoose.Schema.ObjectId,
    ref: "Comment",
    default: [] 
  }],
  user:[{
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required:[true, "Please Author is required"]
  }],
  // photo:{
  //     type:String,
  //     required: [true, "Post image is required"]
  // }
},{
  timestamps:true,
  toJSON : {virtuals:true},
  toObject: { virtuals: true }
});

// hook

// Define the virtual field
// Add views count as virtual field
// Add views count as virtual field
PostSchema.virtual('viewsCount').get(function () {
  return (this.numViews ? this.numViews.length : 0) + (this.guestViews ? this.guestViews.length : 0);
});

// Add likes count as virtual field
// PostSchema.virtual('likesCount').get(function () {
//   return this.likes ? this.likes.length : 0;
// });

// compile the post model
const Post  = mongoose.model('Post',PostSchema)
module.exports = Post;