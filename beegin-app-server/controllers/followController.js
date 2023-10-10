const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const followService = require('../services/followServices');

exports.followingOtherUser = (req, res, next) => {
    followService.followingOtherUser(req.body.followingId, req.user.id)
        .then((data) => {
            return res.status(200).json(data)
        })
        .catch((err) => {
            return next(err)
        });
};
exports.getAllFollowings = (req, res, next) => {
    followService.getAllFollowings(req.params.id)
    .then((data) => {
        return res.status(200).json(
            data
        )
    })
    .catch((err) => {
        return next(err)
    });
};
exports.getAllFollowers = (req, res, next) => {
    followService.getAllFollowers(req.params.id)
    .then((data) => {
        return res.status(200).json(
            data
        )
    })
    .catch((err) => {
        return next(err)
    });
    
};
exports.unfollow = (req, res, next) => {
    followService.unfollow(req.user.id,req.params.followingId)
    .then((data) => {
        return res.status(200).json(
            data
        )
    })
    .catch((err) => {
        return next(err)
    });
};