import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "There was an error creating the post",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "There was an error getting all posts",
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await PostModel.distinct("tags").exec();
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "There was an error getting all tags",
    });
  }
};
export const getByTag = async (req, res) => {
  try {
    const posts = await PostModel.find({ tags: req.params.tag }).populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "There was an error getting all posts",
    });
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "There was an error getting the post",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        return res.json(doc);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "There was an error getting the post by id",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "There was an error deleting the post",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "There was an error updating the post",
    });
  }
};
