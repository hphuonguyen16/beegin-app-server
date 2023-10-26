const catchAsync = require("./../utils/catchAsync");
const commentServices = require("./../services/commentServices");

exports.setUserPostId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.post) req.body.post = req.params.postId;
  next();
};

exports.createComment = catchAsync(async (req, res, next) => {
  const data = await commentServices.createComment(req.body);
  res.status(201).json(data);
});

exports.getCommentsOfPost = catchAsync(async (req, res, next) => {
  const data = await commentServices.getCommentsOfPost(req.body);
  res.status(200).json(data);
});

exports.getComment = catchAsync(async (req, res, next) => {
  const data = await commentServices.getCommentsOfPost(req.body);
  res.status(200).json(data);
});

exports.updateComment = catchAsync(async (req, res, next) => {
  //set userid to check if having permission to update comment
  if (!req.body.user) req.body.user = req.user.id;
  const data = await commentServices.updateComment(req.params.id, req.body);
  res.status(200).json(data);
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  //set userid to check if having permission to delete comment
  const data = await commentServices.deleteComment(req.params.id, req.user.id);
  res.status(202).json({
    status: "success",
  });
});

exports.likeComment = catchAsync(async (req, res, next) => {
  const data = await commentServices.likeComment(req.params.id, req.body.user);
  res.status(201).json(data);
});

exports.unlikeComment = catchAsync(async (req, res, next) => {
  const data = await commentServices.unlikeComment(
    req.params.id,
    req.body.user
  );
  res.status(202).json(data);
});