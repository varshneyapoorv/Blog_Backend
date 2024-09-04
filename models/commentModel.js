const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Comment description is required']
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'Post ID is required']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
