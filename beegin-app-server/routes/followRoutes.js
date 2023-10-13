const express = require('express');
const followController = require('./../controllers/followController');
const authController = require('./../controllers/authController');


const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/followingOtherUser', followController.followingOtherUser);
router.get('/getAllFollowings/:id', followController.getAllFollowings);
router.get('/getAllFollowers/:id', followController.getAllFollowers);
router.delete('/unfollow/:followingId', followController.unfollow);
router.get('/getNumberOfFollows/:id', followController.getNumberOfFollows);





module.exports = router;