const MessageModel = require('../models/messageModel')
const FollowModel = require('./../models/followModel');
const ProfileModel = require('./../models/profileModel');

exports.getFriendsAndRecentMessage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                reject(new AppError(`Missing parameter`, 400));
            }
            else {
                let friendIds = [];
                const followings = await FollowModel.find({ follower: id }).lean();
                const followers = await FollowModel.find({ following: id }).lean();
                followings.map(following => followers.map(follower => {
                    if (following.following.toString() === follower.follower.toString())
                        friendIds.push(following.following);
                })
                )

                const friends = await ProfileModel.find({ user: { $in: friendIds } }).lean();
                const projectFriends = await Promise.all(friends.map(async (friend) => {
                    const msg = await MessageModel.findOne({
                        $or: [
                            { $and: [{ sender: id }, { receiver: friend.user }] },
                            { $and: [{ sender: friend.user }, { receiver: id }] }]
                    }).sort({ createdAt: -1 }).lean()
                    return {
                        friend: friend,
                        message: msg === null ? null : {
                            id: msg._id,
                            fromSelf: msg.sender.toString() === id,
                            type: msg.type,
                            content: msg.content
                        }
                    }
                }))
                resolve({ status: 'Success', data: projectFriends })
            }
        } catch (error) {
            reject(error);
        }
    })
}

exports.getFriendMessages = (userId, friendId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId || !friendId) {
                reject(new AppError(`Missing parameter`, 400));
            }
            else {
                const messages = await MessageModel.find(
                    {
                        $or: [
                            { $and: [{ sender: userId }, { receiver: friendId }] },
                            { $and: [{ sender: friendId }, { receiver: userId }] }]
                    }).lean();

                const projectMessages = messages.map((msg) => {
                    return {
                        id: msg._id,
                        fromSelf: msg.sender.toString() === userId,
                        type: msg.type,
                        content: msg.content,
                        createdAt: msg.createdAt
                    }
                })

                resolve({
                    status: "success",
                    data: projectMessages,
                });
            }
        }
        catch (error) {
            reject(error);
        }
    })
}

exports.getChatImages = (userId, friendId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId || !friendId) {
                reject(new AppError(`Missing parameter`, 400));
            }
            else {
                const images = await MessageModel.find(
                    {
                        type: "image",
                        $or: [
                            { $and: [{ sender: userId }, { receiver: friendId }] },
                            { $and: [{ sender: friendId }, { receiver: userId }] }]
                    }).lean();

                const projectImages = images.map((msg) => {
                    return msg.content
                })

                resolve({
                    status: "success",
                    data: projectImages,
                });
            }
        }
        catch (error) {
            reject(error);
        }
    })
}

exports.sendMessage = (userId, receiverId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId || !data.content === undefined) {
                reject(new AppError(`Missing parameter`, 400));
            }
            else {
                const message = new MessageModel({
                    sender: userId,
                    receiver: receiverId,
                    type: data.type,
                    content: data.content
                })

                await message.save();

                resolve({
                    status: "success",
                    data: message,
                });
            }
        }
        catch (error) {
            reject(error);
        }
    })
}

exports.deleteMessage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await MessageModel.findByIdAndRemove(id)

            resolve({
                status: "success"
            });
        }
        catch (error) {
            reject(error);
        }
    })
}

exports.updateMessageStatus = (userId, receiver, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (status === "seen") {
                const lastMessage = await MessageModel.find({
                    receiver: userId,
                    sender: receiver,
                })
                    .limit(1)
                    .sort({ $natural: -1 });

                if (lastMessage.length > 0) {
                    await MessageModel.updateOne(
                        { _id: lastMessage[0]._id },
                        {
                            $set: {
                                status: status,
                            },
                        }
                    );
                }

            } else if (status === "delivered") {
                const chats = await ChatModel.find({ members: userId });

                const chatIDs = chats.map((chat) => {
                    return chat._id;
                });

                await MessageModel.updateMany(
                    {
                        chatId: { $in: chatIDs },
                        senderId: { $ne: userId },
                        status: "sent",
                    },
                    {
                        status: status,
                    }
                );
            }

        } catch (error) {
            reject(error);
        }
    })
};