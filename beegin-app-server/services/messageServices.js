const MessageModel = require('../models/messageModel')

exports.getFriendsAndRecentMessage = () => { }

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
                resolve({
                    status: "success",
                    data: messages,
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
            console.log(data)
            if (!userId || !data.content === undefined) {
                reject(new AppError(`Missing parameter`, 400));
            }
            else {
                const message = new MessageModel({
                    sender: userId,
                    receiver: receiverId,
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