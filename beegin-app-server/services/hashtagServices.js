const AppError = require("../utils/appError");
const Hashtag = require("./../models/hashtagModel");

exports.createHashtags = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { postContent } = data;

      //filter post hashtags
      const hashtags = postContent.match(/#(\w+)/g);

      //create posthashtag
      await hashtags.forEach(async (element) => {
        const hashtag = await Hashtag.findOne({ name: element });
        if (!hashtag) {
          await Hashtag.create({ name: element });
        }
      });
      resolve({
        status: "success",
      });
    } catch (err) {
      reject(err);
    }
  });
};
