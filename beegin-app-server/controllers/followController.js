const catchAsync = require('./../utils/catchAsync');
const followService = require('../services/followServices');

exports.followingOtherUser = catchAsync(async(req, res, next) => {
    const data = await followService.followingOtherUser(req.body.followingId, req.user.id);
    return res.status(200).json(
        data
    );
});
exports.getAllFollowings = catchAsync(async(req, res, next) => {
    const data = await followService.getAllFollowings(req.params.id);
        return res.status(200).json(
            data
        )

});
exports.getAllFollowers = catchAsync(async(req, res, next) => {
    const data = await followService.getAllFollowers(req.params.id)
        return res.status(200).json(
            data
        )
    
});
exports.unfollow = catchAsync(async(req, res, next) => {
    const data = followService.unfollow(req.user.id, req.params.followingId);
        return res.status(200).json(
            data
        )
});
exports.getNumberOfFollows = catchAsync(async(req, res, next) => {
    const data = await followService.getNumberOfFollows(req.params.id);
        return res.status(200).json(
            data
        )
});

exports.getMyFollowingList = catchAsync(async(req, res, next) => {
    const data = await followService.getAllFollowings(req.user.id);
        return res.status(200).json(
            data
        )

});
exports.getMyFollowerList = catchAsync(async (req, res, next) => {
    const data = await followService.getAllFollowers(req.user.id)
        return res.status(200).json(
            data
        )
    
});
exports.getMyNumberOfFollows = catchAsync(async(req, res, next) => {
    const data = await followService.getNumberOfFollows(req.user.id);
        return res.status(200).json(
            data
        )
});