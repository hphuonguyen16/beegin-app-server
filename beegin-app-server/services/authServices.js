const UserModel = require("./../models/userModel");
const ProfileModel = require("./../models/profileModel");
const AppError = require("./../utils/appError");
const crypto = require("crypto");
const sendEmail = require("./../utils/sendEmail");
exports.signup = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data);
      console.log(
        data.email,
        data.password,
        data.passwordConfirm,
        data.firstname,
        data.lastname,
        data.gender
      );
      if (
        !data.email ||
        !data.password ||
        !data.passwordConfirm ||
        !data.firstname ||
        !data.lastname ||
        data.gender === undefined
      ) {
        reject(new AppError("Missing parameter", 400));
      } else if (data.password !== data.passwordConfirm) {
        reject(new AppError("Confirmation password is incorrect", 400));
      } else {
        const verifyToken = crypto.randomBytes(32).toString("hex");
        const user = await UserModel.create({
          phonenumber: data.phonenumber,
          email: data.email,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          role: data.role,
          verifyToken: verifyToken,
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
        });
        console.log(user);
        const url = `${process.env.CLIENT_URL}/verify/${user._id}/${verifyToken}`;
        console.log(url);
        await sendEmail(user.email, "Email Verification", url);
        resolve(profile);
      }
    } catch (error) {
      reject(error);
    }
  });
};

exports.login = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = data;
      if (!email || !password) {
        reject(new AppError("Please provide email and password!", 400));
      }
      // 2) Check if user exists && password is correct
      const user = await UserModel.findOne({ email }).select("+password");

      console.log(user);

      if (!user || !(await user.correctPassword(password, user.password))) {
        reject(new AppError("Incorrect email or password", 401));
      }
      if (!user.verify) {
        if (!user.verifyToken) {
          const verifyToken = crypto.randomBytes(32).toString("hex");
          await UserModel.findByIdAndUpdate(user._id, {
            verifyToken: verifyToken,
          });
          const url = `${process.env.CLIENT_URL}/verify/${user._id}/${verifyToken}`;
          await sendEmail(user.email, "Email Verification", url);
        }
        reject(
          new AppError("An Email sent to your account! Please verify", 401)
        );
      }
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

exports.verifyToken = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({ _id: userId });
      if (!user) reject(new AppError("User not found", 404));
      if (!user.verifyToken) reject(new AppError("Token not found", 404));

      const currentUser = await UserModel.findByIdAndUpdate(user._id, {
        verify: true,
        verifyToken: null,
      });
      resolve(currentUser);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await UserModel.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
