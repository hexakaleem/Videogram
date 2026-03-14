import express from 'express'
import { addToWatchHistory, changeCurrentPassword, getAllChannels, getCurrentUser, getMySubscriptionStats, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateCoverImage, updateUserAvatar } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router()

// ROUTES
router.route('/register').post(
    // Multer Middleware
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },

        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser)


router.route('/login').post(loginUser)
router.route('/refreshtokens').post(refreshAccessToken)

// Secured Routes
router.route('/logout').get(verifyJWT, logoutUser)
router.route('/changepassword').post(verifyJWT, changeCurrentPassword)
router.route('/currentuser').get(verifyJWT, getCurrentUser)
router.route('/updatedetails').patch(verifyJWT, updateAccountDetails)


router.route('/updateavatar').post(
    verifyJWT,
    upload.single('avatar'),
    updateUserAvatar
)



router.route('/updatecoverimage').post(
    verifyJWT,
    upload.fields([
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    updateCoverImage
)


router.route('/subscriptions').get(verifyJWT, getMySubscriptionStats)

router.route('/channel/:username').get(verifyJWT, getUserChannelProfile)

router.route('/watch-history').get(verifyJWT, getWatchHistory)

router.route('/watch-history/:videoId').post(verifyJWT, addToWatchHistory)

router.route('/all-channels').get(verifyJWT, getAllChannels)


export default router;