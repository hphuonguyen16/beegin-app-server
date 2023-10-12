const UserModel = require("./../models/userModel");
const ProfileModel = require("./../models/profileModel");
const AppError = require("./../utils/appError");
exports.signup = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.password ||
        !data.passwordConfirm ||
        !data.firstname ||
        !data.lastname ||
        !data.gender
      ) {
        reject(new AppError("Missing parameter", 400));
      } else if (data.password !== data.passwordConfirm) {
        reject(new AppError("Confirmation password is incorrect", 400));
      } else {
        let isExist = await checkUserEmail(data.email);
        if (!isExist) {
          const user = await UserModel.create({
            phonenumber: data.phonenumber,
            email: data.email,
            password: data.password,
            passwordConfirm: data.passwordConfirm,
            role: data.role,
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
          resolve(profile);
        } else reject(new AppError("Email is already exist", 400));
      }
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
