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
    throw new Error('NotFound');
  }
  if (blog.author != userId) {
    throw new Error('Unauthorized');
  }
  return await Blog.findByIdAndUpdate(blogId, blogBody).exec();
};

const deleteById = async function(blogId, userId) {
  const blog = await Blog.findById(blogId).exec();
  if (blog === null) {
    throw new Error('NotFound');
  }
  if (blog.author != userId) {
    throw new Error('Unauthorized');
  }
  return await Blog.findByIdAndDelete(blogId).exec();
};

const search = async function({title, tag}) {
  if (title && tag) {
    return await Blog.find({tags: tag, $text: {$search: title}}).exec();
  } else if (title) {
    return await Blog.find({$text: {$search: title}}).exec();
  } else if (tag) {
    return await Blog.find({tags: tag}).exec();
  } else {
    return await Blog.find().exec();
  }
};

module.exports = {
  getAll,
  create,
  edit,
  deleteById,
  search,
};
