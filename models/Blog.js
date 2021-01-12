const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 256,
    index: true,
  },
  body: {
    type: String,
  },
  photos: [String],
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
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

blogSchema.index({'created_at': 1});
blogSchema.index({'tags': 1});

const blogModel = mongoose.model('Blog', blogSchema);

module.exports = blogModel;
