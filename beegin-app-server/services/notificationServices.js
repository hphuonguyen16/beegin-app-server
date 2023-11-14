const NotificationModel = require("./../models/notificationModel");
const AppError = require("./../utils/appError");

exports.getAllNotification = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        reject(new AppError(`Missing parameter`, 400));
      } else {
          const data = await NotificationModel.find({user: id,});
          resolve({
              status: "Success",
              data: data,
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};