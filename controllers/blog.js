const Blog = require('../models/Blog');

const getAll = async function() {
  return await Blog.find().exec();
};

const create = function(blog) {
  return Blog.create(blog);
};

const edit = async function(blogBody, blogId, userId) {
  const blog = await Blog.findById(blogId).exec();
  if (blog === null) {
    throw new Error('Not Found');
  }
  if (blog.author != userId) {
    throw new Error('Not your blog!!');
  }
  return await Blog.findByIdAndUpdate(blogId, blogBody).exec();
};

const deleteById = async function(blogId, userId) {
  const blog = await Blog.findById(blogId).exec();
  if (blog === null) {
    throw new Error('Not Found');
  }
  if (blog.author != userId) {
    throw new Error('Not your blog!!');
  }
  return await Blog.findByIdAndDelete(blogId).exec();
};

module.exports = {
  getAll,
  create,
  edit,
  deleteById,
};
