import express from "express";
import { deleteThumbnail, generateThumbnail } from "../controllers/ThumbnailControllers.js";

const ThumbnailRouter = express();

ThumbnailRouter.post('/generate', generateThumbnail);
ThumbnailRouter.post('/delete/:id', deleteThumbnail);

export default ThumbnailRouter;