const AppError = require("../utils/appError");
const Hashtag = require("./../models/hashtagModel");

exports.createHashtags = (content) => {
  return new Promise(async (resolve, reject) => {
    try {
      //filter post hashtags
      const hashtags = content.match(/#(\w+)/g);
      console.log(hashtags);
      //create posthashtag
      // await hashtags.forEach(async (element) => {
      //   const hashtag = await Hashtag.findOne({ name: element });
      //   if (!hashtag) {
      //     await Hashtag.create({ name: element });
      //   }
      // });
      resolve({
        status: "success",
      });
    } catch (err) {
      reject(err);
    }
  });
};
