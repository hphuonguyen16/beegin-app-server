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
