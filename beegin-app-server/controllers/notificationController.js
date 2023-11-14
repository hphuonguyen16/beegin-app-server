const catchAsync = require('./../utils/catchAsync');
const notificationService = require('../services/notificationServices');

exports.getAllNotification = catchAsync(async (req, res) => {
    const data = await notificationService.getAllNotification(req.user.id);
    return res.status(200).json(
        data
    );
});