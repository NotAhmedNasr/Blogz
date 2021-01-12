const Blog = require('../models/Blog');

const getAll = async function() {
  return await Blog.find().exec();
};

module.exports = {
  getAll,
};
