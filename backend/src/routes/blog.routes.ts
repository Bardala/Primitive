import { BlogController } from "../controllers/blog.controller";
import { db } from "../dataStore";
import express from "express";
import asyncHandler from "express-async-handler";

const router = express.Router();
const blog = new BlogController(db);

// *Blog Routes
router.post("/api/v0/blog", asyncHandler(blog.createBlog));
router.put("/api/v0/blog/:blogId", asyncHandler(blog.updateBlog));
router.get("/api/v0/blog/:blogId", asyncHandler(blog.getBlog));
router.delete("/api/v0/blog/:blogId", asyncHandler(blog.deleteBlog));

router.get("/api/v0/blogComments/:blogId", asyncHandler(blog.getBlogComments)); // done
router.get("/api/v0/blogLikes/:blogId", asyncHandler(blog.getBlogLikes)); // done
router.get(
  "/api/v0/blogLikesList/:blogId",
  asyncHandler(blog.getBlogLikesList),
); //done
router.post("/api/v0/likeBlog/:blogId", asyncHandler(blog.likeBlog)); // done
router.delete("/api/v0/unLikeBlog/:blogId", asyncHandler(blog.unLikeBlog)); //done

export { router };
