import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ isPublished: true }).populate("owner", "username fullName avatar");

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

export {
    getAllVideos
};
