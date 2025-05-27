// middleware/isAuthor.js
const Book= require('../models/sell');

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const post = await Book.findById(id);

  if (!post) {
    return res.status(404).send('Post not found');
  }

  if (!post.user.equals(req.user._id)) {
    return res.status(403).send('You are not authorized to delete this post.');
  }

  next();
};
