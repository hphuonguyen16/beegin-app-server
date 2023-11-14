const catchAsync = require("../utils/catchAsync");
const factory = require("../controllers/handlerFactory");
const messageService = require('../services/messageServices')

exports.getFriendsAndRecentMessage = catchAsync(async (req, res, next) => {
    const data = await messageService.getFriendsAndRecentMessage(req.user.id);
    res.status(200).json(data);
})

exports.getFriendMessages = catchAsync(async (req, res, next) => {
    const data = await messageService.getFriendMessages(req.user.id, req.params.id);
    res.status(200).json(data);
})

exports.getChatImages = catchAsync(async (req, res, next) => {
    const data = await messageService.getChatImages(req.user.id, req.params.id);
    res.status(200).json(data);
})

exports.sendMessage = catchAsync(async (req, res, next) => {
    const data = await messageService.sendMessage(req.user.id, req.params.id, req.body);
    res.status(201).json(data);
})

exports.deleteMessage = catchAsync(async (req, res, next) => {
    const data = await messageService.deleteMessage(req.params.id);
    res.status(201).json(data);
})

exports.updateMessageStatus = catchAsync(async (req, res, next) => {
    const data = await messageService.updateMessageStatus(req.user.id, req.params.id, req.body.status);
    res.status(201).json(data);
})