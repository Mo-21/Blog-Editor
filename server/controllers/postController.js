const Post = require("../models/posts");
const Comment = require("../models/comments");

//Getting All Posts
exports.get_posts = async (req, res) => {
  try {
    const posts = await Post.find({ isDraft: false }).exec();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Getting One Post
exports.get_one_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("comments")
      .populate("author")
      .exec();
    if (post.isDraft === true) return res.sendStatus(401).json("Not Allowed");
    const comments = [];
    post.comments.map((comment) => {
      comments.push(comment);
    });

    const allComments = [];
    for (let i = 0; i < comments.length; i++) {
      allComments.push(await Comment.findById(comments[i]).lean());
    }
    let formattedData;
    for (let i = 0; i < allComments.length; i++) {
      const originalDate = new Date(allComments[i].creationDate);

      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, "0");
      const day = String(originalDate.getDate()).padStart(2, "0");
      const hours = String(originalDate.getHours()).padStart(2, "0");
      const minutes = String(originalDate.getMinutes()).padStart(2, "0");
      const seconds = String(originalDate.getSeconds()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      const formattedDateTime = `${formattedDate} ${formattedTime}`;
      formattedData = allComments.map((item) => ({
        ...item,
        creationDate: formattedDateTime, // Replace with the actual formatted date and time string
      }));
    }

    if (post === null) {
      res.status(500).json("Null, Cannot Find This Post.");
    } else {
      res.status(200).json({
        _id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        comments: formattedData,
        createdAt: post.creation_time_formatted,
        updatedAt: post.updatedAt_time_formatted,
      });
    }
    return;
  } catch (err) {
    res.status(500);
  }
};
