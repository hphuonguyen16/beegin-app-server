const catchAsync = require("./../utils/catchAsync");
const postServices = require("./../services/postServices");

exports.search = catchAsync(async (req, res, next) => {
  let data;
  if (req.query.hashtag) {
    data = await postServices.getPostsByHashtag(req.query.hashtag, req.query);
  }
  res.status(200).json(data);
});
