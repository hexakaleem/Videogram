import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';











// Generate Tokens before Logging In
async function generateAccessAndRefreshTokens(userId) {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // console.log("TOKENSSSSS: ", accessToken, refreshToken)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        // console.log("USERRRR:::::" , user)

        return { accessToken, refreshToken }

    } catch (error) {
        console.log(`ERROR: ${error.message}`)
        throw new ApiError(500, 'Something Went Wrong while creating Access and Refresh Tokens')
    }
}











const registerUser = asyncHandler(async (req, res, next) => {
    // 1. Take user details from frontend
    const { fullName, username, email, password } = req.body
    console.log(email, username, fullName, password)


    // 2. Validate Data
    if (
        [fullName, email, username, password].some((field) => {
            return !field || field.trim() === ""
        })
    ) {
        throw new ApiError(400, 'All fields are required!')
    }

    // 3. Check if User Already exists (with email and username)
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (user) {
        throw new ApiError(409, 'User already exists!!')
    }


    // 4. Check for Avatar
    // 5. Check for Check Image
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path


    // 6. Upload the photos on cloudinary, Check if avatar is uploaded
    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null

    const DEFAULT_AVATAR = "https://res.cloudinary.com/demo/image/upload/d_avatar.png/avatar.png"

    // 7. Create user Object
    // 8. Create user in Database
    const createdUser = await User.create({
        fullName,
        username,
        email,
        password,
        avatar: avatar?.url || DEFAULT_AVATAR,
        coverImage: coverImage?.url || ""
    })


    // 9. Remove Password and Refresh token from response
    const returnedUser = await User.findById(createdUser._id).select("-password -refreshToken")


    // 10. Check for user Creation
    if (!returnedUser) {
        throw new ApiError(500, 'There was an error Creating Account')
    }

    // 11. Return response
    return res.status(200).json(
        new ApiResponse(
            200,
            returnedUser,
            'User Registered Successfully!'
        )
    )

})










const loginUser = asyncHandler(async (req, res, next) => {
    // 1. Take data from req.body
    const { username, email, password } = req.body
    if (!username && !email) {
        throw new ApiError(400, 'Email or Username is required!')
    }

    if (!password) {
        throw new ApiError(400, 'Password is required')
    }

    // 2. Username or Email based Login

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    // 3. Check if User exists

    if (!user) {
        throw new ApiError(404, 'User does not Exist!')
    }

    // 4. Verify Password
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new ApiError(400, 'Incorrect Password')
    }

    // 5. Generate Access and Refresh Tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    // Now the problem is that the user reference we have does not have the refreshToken.
    // Either we store the refreshToken in the user or just run another query - depends on the situation

    // Either This
    // user.refreshToken = refreshToken 

    // Or This
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // 6. Send the tokens in Cookies
    const options = {
        httpOnly: true, // can only be modified from Server Now
        secure: true // cookies sent over HTTPS
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        // 7. Send response
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, refreshToken, accessToken
                },
                'User LoggedIn Successfully!'

            )
        )
})










const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true // You get the Updated Value
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User Logged Out Successfully"
            )
        )
})










const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(404, 'No RefreshToken Found!')
    }

    /*
    const user = await User.findOne({refreshToken: incomingRefreshToken})
    if(!user){
        throw new ApiError(401, 'Unauthorized Request: No User Found')
    }

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(401, "Invalid Refresh Token")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    */

    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or Expired Token")
    }

    const user = await User.findById(decodedToken?._id)
    if (!user || incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh Token Does not Match")
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }


    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user, accessToken },
                "Tokens Refreshed Successfully"
            )
        )
})









const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
        throw new ApiError(401, "Passwords Does Not Match")
    }


    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect Password!")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password Changed Successfully"
            )
        )

})









const getCurrentUser = asyncHandler(async (req, res, next) => {
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Here is the Current User"
            )
        )
})









const updateAccountDetails = asyncHandler(async (req, res, next) => {
    const { fullName, username, email } = req.body

    if (
        [fullName, username, email].some((field) => {
            return field.trim == ""
        })
    ) {
        throw new ApiError(400, 'All fields are Required!')
    }

    const user = await User.findByIdAndUpdate(
        req?.user._id,
        {
            $set:
                { fullName: fullName, username, email }

        },
        { new: true }
    ).select("-password -refreshToken")


    return res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Account Details Updated Successfully"
            )
        )

})









const updateUserAvatar = asyncHandler(async (req, res, next) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, 'Please Upload Aavatar')
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(500, 'There was an error Uploading Avatar on cloudinary')
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:
                { avatar: avatar.url }
        },
        { new: true }

    ).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Avatar Updated Successfully"
        )
    )

})










const updateCoverImage = asyncHandler(async (req, res, next) => {

    // If you user upload.fields([{name: 'coverImage}]) then use req.files?.coverImage[0]?.path
    // If you user upload.single('coverImage'), then this syntax is good

    // const coverImageLocalPath = req.file?.path

    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Please Upload Cover Image")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage) {
        throw new ApiError(500, "There was an error uploading Cover Image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:
                { coverImage: coverImage.url }
        },

        { new: true }
    )
        .select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "CoverImage Updated Successfully"
        )
    )
})







const getMySubscriptionStats = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const stats = await Subscription.aggregate([

        {
            $facet: {
                subscribers: [
                    { $match: { channel: userId } },
                    { $count: "count" }
                ],
                subscribedTo: [
                    { $match: { subscriber: userId } },
                    { $count: "count" }
                ]
            }
        }
    ])

    //Returns this
    /*
    stats = [{
            subscribers: [{ count: 12 }],
            subscribedTo: [{ count: 5 }]
        }]
    */

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                subscribers: stats[0].subscribers[0]?.count || 0,
                subscribedTo: stats[0].subscribedTo[0]?.count || 0
            },
            "Subscription stats fetched successfully"
        )
    )
})







const getUserChannelProfile = asyncHandler(async (req, res, next) => {
    const { username } = req.params
    if (!username?.trim()) {
        throw new ApiError(401, "Username is Missing")
    }

    const channel = await User.aggregate([
        { $match: { username: username?.toLowerCase() } },

        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },

        // THE USUAL CONFUSION - Stages recieve the stream coming from above not just the output of the previous stream
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },

        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },

                subscribedToCount: {
                    $size: "$subscribedTo"
                },


                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },

        // Comment this Project and see the output of the "channel"
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    console.log(channel)
    if (!channel?.length) {
        throw new ApiError(404, "Channel Not Found!")
    }


    return res.status(200)
        .json(
            new ApiResponse(
                200,
                channel,
                "User Channel Fetched Successfully"
            )
        )
})





const getWatchHistory = asyncHandler(async (req, res, next) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },

        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",

                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",

                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },

                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watched History Fetched Successfully"
            )
        )
})


const getAllChannels = asyncHandler(async (req, res) => {
    const channels = await User.find({}).select("username fullName avatar email");
    return res.status(200).json(
        new ApiResponse(200, channels, "Channels fetched successfully")
    );
})

const addToWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {
                watchHistory: videoId
            }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, {}, "Video added to watch history")
    );
})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getMySubscriptionStats,
    getUserChannelProfile,
    getWatchHistory,
    getAllChannels,
    addToWatchHistory
}