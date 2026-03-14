import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ isPublished: true }).populate("owner", "username fullName avatar");

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description, thumbnail, duration } = req.body;

    if (!title || !description || !thumbnail) {
        throw new ApiError(400, "Title, description, and thumbnail are required");
    }

    const video = await Video.create({
        title,
        description,
        thumbnail,
        videoFile: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Dummy video file
        duration: duration || 0,
        owner: req.user._id,
        isPublished: true
    });

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
});

export {
    getAllVideos,
    publishVideo
};
