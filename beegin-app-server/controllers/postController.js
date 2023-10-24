const catchAsync = require("./../utils/catchAsync");
const postServices = require("./../services/postServices");
const factory = require("./../controllers/handlerFactory");
const Post = require("./../models/postModel");

exports.getAllPost = factory.getAll(Post);

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createPost = catchAsync(async (req, res, next) => {
  const data = await postServices.createPost(req.body);
  res.status(201).json(data);
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const data = await postServices.getPostById(req.params.id);
  res.status(200).json(data);
});
