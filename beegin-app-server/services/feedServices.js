const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Feed = require("./../models/feedModel");

exports.getFeedByUser = (id, query) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
      }
    } catch (err) {
      reject(err);
    }
  });
};
