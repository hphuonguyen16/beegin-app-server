const Post = require("./../models/postModel");
const AppError = require("./../utils/appError");

exports.createPost = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.create({
        content: data.content,
        images: data.images,
        imageVideo: data.imageVideo,
        categories: data.categories,
        user: data.user,
      });
      resolve({
        status: "success",
        data: post,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getPostById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(id).populate({
        path: "user",
        select: "_id email profile",
        populate: {
          path: "profile",
          model: "Profile",
          select: "name avatar fullname",
        },
      });
      if (!post) {
        reject(new AppError(`Post not found`, 404));
      }

      resolve({
        status: "success",
        data: post,
      });
    } catch (err) {
      reject(err);
    }
  });
};
