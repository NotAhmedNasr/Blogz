const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 256,
  },
  body: {
    type: String,
  },
  photo: {
    type: String,
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

blogSchema.index({'created_at': 1});
blogSchema.index({'tags': 1});
blogSchema.index({'author': 1});
blogSchema.index({'title': 'text'});

const blogModel = mongoose.model('Blog', blogSchema);

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

commentSchema.index({'created_at': 1});

const commentModel = mongoose.model('Comment', commentSchema);


module.exports = {
  blogModel,
  commentModel,
};
