const {blogModel: Blog, commentModel: Comment} = require('../models/Blog');
const User = require('../models/User');

const getAll = async function(page, count, query) {
  return await Blog.find(query, {}, {skip: (+page * +count), limit: +count})
      .populate('author')
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
        },
      })
      .sort([['created_at', -1]])
      .exec();
};

const getFollowing = async function(id, page, count) {
  const {following: followedUsers} = await User.findById(id, {following: 1});
  return Blog.find({author: {$in: followedUsers}}, {},
      {skip: (+page * +count), limit: +count})
      .populate('author')
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
        },
      })
      .sort([['created_at', -1]])
      .exec();
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

const search = async function({title, tags, author, page, count}) {
  const query = {};
  if (title) {
    query.$text = {$search: title};
  }
  if (tags) {
    query.tags = tags;
  }
  if (author) {
    query.author = author;
  }
  return await Blog.find(query, {},
      {skip: (+page * +count), limit: +count})
      .populate('author')
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
        },
      })
      .sort([['created_at', -1]])
      .exec();
};

const like = async function(user, id) {
  return await Blog.findByIdAndUpdate(
      id, {$addToSet: {likers: user}}, {new: true})
      .exec();
};

const unlike = async function(user, id) {
  return await Blog.findByIdAndUpdate(id, {$pull: {likers: user}}, {new: true})
      .exec();
};

const comment = async function(body, blogId) {
  try {
    const comm = await Comment.create(body);
    return await Blog
        .findByIdAndUpdate(blogId, {$push: {comments: comm}}, {new: true})
        .populate('author')
        .populate({
          path: 'comments',
          populate: {
            path: 'commenter',
          },
        })
        .exec();
  } catch (error) {
    throw new Error(error);
  }
};

const uncomment = async function(comId, blogId) {
  await Comment.findByIdAndRemove(comId).exec();
  return await Blog.findByIdAndUpdate(
      blogId, {$pull: {comments: comId}}, {new: true})
      .populate('author')
      .populate({
        path: 'comments',
        populate: {
          path: 'commenter',
        },
      })
      .exec();
};

module.exports = {
  getAll,
  create,
  edit,
  deleteById,
  search,
  getFollowing,
  like,
  unlike,
  comment,
  uncomment,
};
