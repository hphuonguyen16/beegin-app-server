const catchAsync = require("./../utils/catchAsync");
const BusinessServices = require("./../services/businessServices");

exports.approveBusinessRequest = catchAsync(async (req, res) => {
  const { id } = req.body;

  const data = await BusinessServices.handleBusinessRequest(id, "approved");

  res.status(200).json(data);
});

exports.cancelBusinessRequest = catchAsync(async (req, res) => {
  const { id } = req.body;
  const data = await BusinessServices.handleBusinessRequest(id, "canceled");

  res.status(200).json(data);
});

exports.signup = catchAsync(async (req, res) => {
  const data = await BusinessServices.businessSignUp(data);

  res.status(201).json({
    status: "success",
    message:
      "An email has been sent to your email address. Please verify your email address to continue to next steps",
  });
});
