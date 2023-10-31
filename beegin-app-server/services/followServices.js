const FollowModel = require('./../models/followModel');
const ProfileModel = require('./../models/profileModel');
const AppError = require('./../utils/appError');

exports.followingOtherUser = (followingId,id) => {
   return new Promise(async (resolve, reject) =>{
        try {
            if (!followingId){
               reject(new AppError(`You haven't chosen who you want to follow`, 400));
            }
            else if (id === followingId ) {
                 reject(new AppError(`Bad request`, 400));
            }
            else {
                let check = await isFollowing(id, followingId);
                if (check) {
                    reject(new AppError(`You already follow this user`, 400));
                }
                else {
                    await FollowModel.create({
                        follower: id,
                        following:followingId
                    });
                    resolve({
                        status:'Success',
                    })
                }    
            }
        } catch (error) {
            reject(error);
        }
    })
};
const isFollowing = async (idFollower, followingId) => {
    const isFollowing = await FollowModel.findOne({ follower: idFollower, following: followingId });
    if (isFollowing) { 
        return true;
    }
    else {
        return false;
    }
}
exports.getAllFollowings = (id) => {
   return new Promise(async (resolve, reject) =>{
       try {
        if (!id) {
            reject(new AppError(`Missing parameter`, 400));
        } else {
            const data = await FollowModel.find({ follower: id });
            const listFollowing = [];
            for (const follow of data) {
                const following = await ProfileModel.find({ user: follow.following }).select('firstname lastname avatar');
                const followingData = {
                    userId: follow.following,
                    profile: following
                };
                listFollowing.push(followingData)
            }
            resolve({
                status: 'Success',
                data: listFollowing
            })
        }
        } catch (error) {
            reject(error);
        }
    })
};
exports.getAllFollowers = (id) => {
   return new Promise(async (resolve, reject) =>{
        try {
            if (!id){
               reject(new AppError(`Missing parameter`, 400));
            }
            else {
                let data = await FollowModel.find({following:id});
                let listFollower = [];
                for (const follow of data) {
                    let follower = await ProfileModel.find({ user: follow.follower }).select('firstname lastname avatar');
                    const followerData = {
                    userId: follow.follower,
                    profile: follower
                };
                listFollower.push(followerData);
                }
                resolve({
                    status: 'Success',
                    data:listFollower
                })
            }
        } catch (error) {
            reject(error);
        }
    })
};
exports.unfollow = (id,followingId) => {
   return new Promise(async (resolve, reject) =>{
        try {
            if (!followingId){
               reject(new AppError(`Missing parameter`, 400));
            }
            else {
                let check = await isFollowing(id, followingId);
                if (!check) {
                    // reject(new AppError(`You don't follow this person yet`, 400));
                    resolve({
                        message: `You don't follow this person`
                    })
                }
                else {
                    await FollowModel.deleteOne({follower:id,following:followingId});
                    resolve({
                        status: 'Success',
                    })
                }     
            }
        } catch (error) {
            reject(error);
        }
    })
};
exports.getNumberOfFollows = (id) => {
   return new Promise(async (resolve, reject) =>{
        try {
            if (!id){
               reject(new AppError(`Missing parameter`, 400));
            }
            else {
                const NumberOfFollowing = await FollowModel.countDocuments({ follower: id });
                const NumberOfFollower = await FollowModel.countDocuments({ following: id });
                resolve({
                    status: 'Success',
                    data: ({
                        NumberOfFollower: NumberOfFollower,
                        NumberOfFollowing: NumberOfFollowing
                        })
                    })
                }     
        } catch (error) {
            reject(error);
        }
    })
};

exports.isFollowing= (idFollower, followingId) => {
    return new Promise(async (resolve, reject) =>{
        try {
            if (!followingId) {
                reject(new AppError(`Missing parameter`, 400));
            }
            else {
                const check = await isFollowing(idFollower, followingId);
                console.log(check);
                resolve({
                    status: 'Success',
                    data: check
                })
            }
        }
        catch (error) {
            reject(error);
        }
    })
}
