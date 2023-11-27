const User = require("../models/userModel");
const FollowModel = require("./../models/followModel");
const ProfileModel = require("./../models/profileModel");
const NotificationModel = require("./../models/notificationModel");
const UserPreferenceModel = require("./../models/userPreferenceModel");
const AppError = require("./../utils/appError");
const { isEqual } = require("lodash");

exports.followingOtherUser = (followingId, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!followingId) {
        reject(new AppError(`You haven't chosen who you want to follow`, 400));
      } else if (id === followingId) {
        reject(new AppError(`Bad request`, 400));
      } else {
        let check = await isFollowing(id, followingId);
        if (check) {
          reject(new AppError(`You already follow this user`, 400));
        } else {
          await FollowModel.create({
            follower: id,
            following: followingId,
          });
          const profile = await ProfileModel.findOne({ user: id }).select(
            "firstname lastname username"
          );
          await NotificationModel.create({
            user: followingId,
            content: `${profile.firstname} ${profile.lastname} has followed you`,
          });
          resolve({
            status: "Success",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
const isFollowing = async (idFollower, followingId) => {
  const isFollowing = await FollowModel.findOne({
    follower: idFollower,
    following: followingId,
  });
  if (isFollowing) {
    return true;
  } else {
    return false;
  }
};
exports.getAllFollowings = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        reject(new AppError(`Missing parameter`, 400));
      } else {
        const data = await FollowModel.find({ follower: id });
        // const listFollowing = [];
        // for (const follow of data) {
        //   const following = await ProfileModel.find({
        //     user: follow.following,
        //   }).select("firstname lastname avatar username");
        //   const followingData = {
        //     userId: follow.following,
        //     profile: following,
        //   };
        //   listFollowing.push(followingData);
        // }
        resolve({
          status: "Success",
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
exports.getAllFollowers = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        reject(new AppError(`Missing parameter`, 400));
      } else {
        let data = await FollowModel.find({ following: id }).select('following');
        // let listFollower = [];
        // for (const follow of data) {
        //   let follower = await ProfileModel.find({
        //     user: follow.follower,
        //   }).select("firstname lastname avatar username");
        //   let check = await isFollowing(id, follow.follower);
        //   const followerData = {
        //     userId: follow.follower,
        //     profile: follower,
        //     status: check,
        //   };
        //   listFollower.push(followerData);
        // }
        resolve({
          status: "Success",
          data
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
exports.unfollow = (id, followingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!followingId) {
        reject(new AppError(`Missing parameter`, 400));
      } else {
        let check = await isFollowing(id, followingId);
        if (!check) {
          // reject(new AppError(`You don't follow this person yet`, 400));
          resolve({
            message: `You don't follow this person`,
          });
        } else {
          await FollowModel.deleteOne({ follower: id, following: followingId });
          resolve({
            status: "Success",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
exports.getNumberOfFollows = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        reject(new AppError(`Missing parameter`, 400));
      } else {
        const NumberOfFollowing = await FollowModel.countDocuments({
          follower: id,
        });
        const NumberOfFollower = await FollowModel.countDocuments({
          following: id,
        });
        resolve({
          status: "Success",
          data: {
            NumberOfFollower: NumberOfFollower,
            NumberOfFollowing: NumberOfFollowing,
          },
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

exports.isFollowing = (idFollower, followingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!followingId) {
        reject(new AppError(`Missing parameter`, 400));
      } else {
        const check = await isFollowing(idFollower, followingId);
        console.log(check);
        resolve({
          status: "Success",
          data: check,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getGeneralFollowingCount = async (userId, otherId) => {
  const listA = await FollowModel.find({ follower: userId });
  const listB = await FollowModel.find({ follower: otherId });
  const followingListA = listA.map((item) => item.following.toString());
  const followingListB = listB.map((item) => item.following.toString());
  const commonFollowings = followingListA.filter((value) =>
    followingListB.includes(value)
  );
  return commonFollowings;
};
const suggestSimilarInterests = async (userId, otherId) => {
  const listA = await UserPreferenceModel.find({ user: userId });
  const listB = await UserPreferenceModel.find({ user: otherId });
  const preferenceListA = listA.map((item) => item.category.toString());
  const preferenceListB = listB.map((item) => item.category.toString());
  const equal = isEqual(preferenceListA.sort(), preferenceListB.sort());
  return equal;
};
exports.suggestFollow = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        reject(new AppError(`Missing parameter`, 400));
      } else {
        let listSuggest = [];
        let listCommonPreference = [];
        const users = await User.find({ role: "user" })
          .populate({
            path: "profile",
            model: "Profile",
            select: "avatar firstname lastname -user username",
          })
          .select("profile");
        for (const user of users) {
          let check = await isFollowing(userId, user._id);
          if (!check && userId !== user._id.toString()) {
            let checkPreference = await suggestSimilarInterests(
              userId,
              user._id
            );
            if (checkPreference) {
              listCommonPreference.push({ user });
            } else {
              let count = await getGeneralFollowingCount(userId, user._id);
              if (count.length > 0) {
                listSuggest.push({ user, count: count.length });
              }
            }
          }
        }
        listSuggest.sort((a, b) => b.count - a.count);
        const top5Suggest = listSuggest.slice(0, 5);
        resolve({
          status: "Success",
          data: top5Suggest,
          data2: listCommonPreference,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
exports.getFriends = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        reject(new AppError(`Missing parameter`, 400));
      } else {
        let friendIds = [];
        const followings = await FollowModel.find({ follower: id }).lean();
        const followers = await FollowModel.find({ following: id }).lean();
        followings.map((following) =>
          followers.map((follower) => {
            if (following.following.toString() === follower.follower.toString())
              friendIds.push(following.following);
          })
        );
        const friends = await ProfileModel.find({ user: { $in: friendIds } });
        resolve({ status: "Success", data: friends });
      }
    } catch (error) {
      reject(error);
    }
  });
};
