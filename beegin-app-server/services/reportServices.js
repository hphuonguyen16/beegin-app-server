const ReportModel = require("./../models/reportModel");
const AppError = require("./../utils/appError");
const { isEqual } = require("lodash");

exports.createReport = (data, reporter) => {
  console.log(data, reporter);
  return new Promise(async (resolve, reject) => {
    try {
      const { post, reason } = data;

      if (!reason || !reporter) {
        reject(new AppError(`Miss parameter`, 400));
      } else {
        await ReportModel.create({
          reporter: reporter,
          post: post,
          reason: reason,
        });
        resolve({
          status: "Success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};


