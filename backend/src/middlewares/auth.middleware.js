import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import {ApiError} from '../utils/ApiError.js'
import { User } from '../models/user.model.js'




export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
            const token = req.cookies?.accessToken || req.header('Authorization')?.split(" ")[1]
        
        
            // Or another Safer Method
            /*
            const token = req.cookies?.accessToken
            if(!token){
                const authHeader = req.header("Authorization")
                if(authHeader && authHeader.startsWith("Bearer ")){
                    token = authHeader.replace("Bearer ", "")
                }
            }
            */
        
            if(!token){
                throw new ApiError(401, "Unauthorized Request")
            }
        
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
            const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        
            if(!user){
                throw new ApiError(401, "Invalid Access Token")
            }
        
            req.user = user
            next()


    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }

})