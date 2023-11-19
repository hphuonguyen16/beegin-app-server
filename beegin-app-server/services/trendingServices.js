const HashtagPost = require("./../models/hashtagPostModel");
const TrendingHashtag = require("./../models/trendingHashtagModel");
const Post = require("./../models/postModel");
const TrendingPost = require("./../models/trendingPostModel");

exports.determineTrendingHashtags = (period = 7) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("update trending hashtag");
      const day = new Date();
      day.setDate(day.getDate() - period);
      const stat = await HashtagPost.aggregate([
        {
          $lookup: {
            from: "posts", // Name of the "Post" collection
            localField: "post",
            foreignField: "_id",
            as: "post",
          },
        },
        {
          $unwind: {
            path: "$post",
            // preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            post: "$post._id",
            hashtag: 1,
            categories: "$post.categories",
          },
        },
        {
          $unwind: {
            path: "$categories",
            //preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: {
              hashtag: "$hashtag",
              category: "$categories",
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            hashtag: "$_id.hashtag",
            category: "$_id.category",
            count: 1,
          },
        },
        {
          $match: {
            category: { $ne: null },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);
      const stats = await HashtagPost.aggregate([
        {
          $match: {
            createdAt: { $gte: day },
          },
        },
        {
          $group: {
            _id: "$hashtag",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            hashtag: "$_id",
            count: 1,
            category: null,
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);
      const result = [...stat, ...stats];
      await TrendingHashtag.deleteMany({});
      await TrendingHashtag.create(result);
      resolve({
        status: "success",
        // data: result,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getTrendingHashtag = (limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await TrendingHashtag.find({}).sort("-count").limit(limit);

      // filter similar hashhtag
      const groupedData = {};
      data.forEach((item) => {
        const currentHashtag = item.hashtag;
        if (
          !groupedData[currentHashtag] ||
          item.count > groupedData[currentHashtag].count ||
          (item.count === groupedData[currentHashtag].count &&
            item.category !== null)
        ) {
          groupedData[currentHashtag] = item;
        }
      });

      data = Object.values(groupedData);
      resolve({
        status: "sucess",
        results: data.length,
        data: data,
      });
    } catch (err) {
      reject(err);
    }
  });
};
// setInterval(this.determineTrendingHashtags, 10000);

// this.determineTrendingHashtags();
exports.determineTrendingPosts = (count = 5, period = 30) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("updating trending posts", new Date());
      const day = new Date();
      day.setDate(day.getDate() - period);
      var results = await Post.aggregate([
        {
          $unwind: "$categories",
        },
        {
          $lookup: {
            from: "comments",
            let: { post: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$post", "$$post"] },
                      { $gte: ["$createdAt", day] },
                    ],
                  },
                },
              },
            ],
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "likeposts",
            let: { post: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$post", "$$post"] },
                      { $gte: ["$createdAt", day] },
                    ],
                  },
                },
              },
            ],
            as: "likes",
          },
        },
        {
          $addFields: {
            totalInteractions: {
              $add: [
                //weight
                { $multiply: [{ $size: "$comments" }, 3] },
                { $multiply: [{ $size: "$likes" }, 2] },
              ],
            },
          },
        },
        {
          $sort: {
            totalInteractions: -1,
            createdAt: -1,
          },
        },
        {
          $group: {
            _id: "$categories",
            posts: {
              $push: {
                _id: "$_id",
                totalInteractions: "$totalInteractions",
                createdAt: "$createdAt",
              },
            },
          },
        },
        {
          $project: {
            category: "$_id",
            _id: 0,
            posts: { $slice: ["$posts", count] },
          },
        },
      ]);
      await TrendingPost.deleteMany({});
      await TrendingPost.create(results);
      resolve({
        status: "success",
        // data: results,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getTrendingPostsByCategories = (categories) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await TrendingPost.find({
        category: { $in: categories },
      })
        .populate("posts")
        .populate("category");
      resolve({
        status: "success",
        data: results,
      });
    } catch (err) {
      reject(err);
    }
  });
};
