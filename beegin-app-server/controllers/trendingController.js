const AppError = require("../utils/appError");
const trendingServices = require("./../services/trendingServices");
const catchAsync = require("./../utils/catchAsync");

exports.getAllTrendingHashtag = catchAsync(async (req, res, next) => {
  const data = await trendingServices.determineTrendingHashtags(30);
  // const da = await hashtagServices.createHashtags(req.body.content);
  res.status(200).json(data);
});

exports.setLimit = (req, res, next) => {
  if (!req.query.limit) req.query.limit = 10;
  next();
};
exports.getTrendingHashtag = catchAsync(async (req, res, next) => {
  const data = await trendingServices.getTrendingHashtag(req.query.limit);
  res.status(200).json(data);
});

// exports.getTrendingPosts1 = catchAsync(async (req, res, next) => {
//   const data = await trendingServices.determineTrendingPosts();
//   res.status(200).json(data);
// });

exports.getTrendingPosts = catchAsync(async (req, res, next) => {
  if (!req.query.category)
    return next(new AppError(`Empty category query`, 400));
  const data = await trendingServices.getTrendingPostsByCategories(
    req.query.category,
    req.user?.id
  );
  res.status(200).json(data);
});
