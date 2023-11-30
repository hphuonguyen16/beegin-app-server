const catchAsync = require('./../utils/catchAsync');
const reportService = require('../services/reportServices');

exports.createReport = catchAsync(async (req, res) => {
    const data = await reportService.createReport(req.body, req.user.id);
    return res.status(200).json(
        data
    );
});
