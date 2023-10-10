const FollowModel = require('./../models/followModel');
const AppError = require('./../utils/appError');

exports.followingOtherUser = (followingId,id) => {
   return new Promise(async (resolve, reject) =>{
        try {
            if (!followingId){
               reject(new AppError(`You haven't chosen who you want to follow`, 400));
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

            if (!id){
                reject(new AppError(`Missing parameter`, 400));
            }
            else {
                let listFollowing = await FollowModel.find({follower:id});
                resolve({
                    status: 'Success',
                    data:listFollowing
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
                let listFollower = await FollowModel.find({following:id});
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
                    reject({
                        message:`You don't follow this person yet`
                    })
                }
                else {
                    await FollowModel.deleteOne({follower:id,following:followingId});
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


