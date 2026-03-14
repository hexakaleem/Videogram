import { Router } from 'express';
import { getAllVideos, publishVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getAllVideos);
router.route("/publish").post(verifyJWT, publishVideo);

export default router;
