const UserModel = require("./../models/userModel");
const ProfileModel = require("./../models/profileModel");
const BusinessRequest = require("./../models/businessRequestModel");

const AppError = require("./../utils/appError");
const crypto = require("crypto");
const sendEmail = require("./../utils/sendEmail");
exports.businessSignUp = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.password ||
        !data.passwordConfirm ||
        !data.firstname ||
        !data.lastname ||
        !data.slug ||
        data.gender === undefined
      ) {
        reject(new AppError("Please fill in all required fields", 400));
      } else if (data.password !== data.passwordConfirm) {
        reject(new AppError("Password confirmation is incorrect", 400));
      } else {
        const verifyToken = crypto.randomBytes(32).toString("hex");
        const user = await UserModel.create({
          phonenumber: data.phonenumber,
          email: data.email,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          role: "business",
          verifyToken: verifyToken,
          preferences: data.preferences,
        });
        const profile = await ProfileModel.create({
          firstname: data.firstname,
          lastname: data.lastname,
          gender: data.gender,
          avatar: data.avatar,
          address: data.address,
          bio: data.bio,
          birthday: data.birthday,
          user: user.id,
          slug: data.slug,
        });

        const businessRequest = await BusinessRequest.create({
          user: user.id,
        });
        if (!businessRequest) {
          reject(new AppError(`An error occurs`, 500));
        }
        const url = `${process.env.CLIENT_URL}/verify/${user._id}/${verifyToken}`;
        await sendEmail(user.email, "Email Verification", url);
        resolve(profile);
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleBusinessRequest = (id, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        reject(new AppError(`Business account not found`, 404));
      }

      if (user.role !== "business") {
        reject(new AppError(`Account is not a business one`, 400));
      }

      if (!user.verify) {
        reject(new AppError(`Business account has not verified yet`, 400));
      }

      const request = await BusinessRequest.findOneAndUpdate(
        { user: id },
        { status: status },
        { new: true }
      );

      if ((status = "approved")) {
        const _ = await UserModel.findByIdAndUpdate(id, {
          approved: true,
        });
      }
      resolve(request);
    } catch (err) {
      reject(err);
    }
  });
};
