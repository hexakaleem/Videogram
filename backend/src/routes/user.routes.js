import express from 'express'
import { changeCurrentPassword, getCurrentUser, getMySubscriptionStats, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router()

// ROUTES
router.route('/register').post(registerUser)

router.route('/login').post(loginUser)
router.route('/refreshtokens').post(refreshAccessToken)

// Secured Routes
router.route('/logout').get(verifyJWT, logoutUser)
router.route('/changepassword').post(verifyJWT, changeCurrentPassword)
router.route('/currentuser').get(verifyJWT, getCurrentUser)
router.route('/updatedetails').patch(verifyJWT, updateAccountDetails)


router.route('/subscriptions').get(verifyJWT, getMySubscriptionStats)

router.route('/channel/:username').get(verifyJWT, getUserChannelProfile)

router.route('/watch-history').get(verifyJWT, getWatchHistory)

export default router;