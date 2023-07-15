import { BlogController } from "./controllers/blog.controller";
import { SpaceController } from "./controllers/space.controller";
import { UserController } from "./controllers/user.controller";
import { db, initDb } from "./dataStore";
import { requireAuth } from "./middleware/authMiddleware";
import { errorHandler } from "./middleware/errorHandler";
import dotenv from "dotenv";
import express from "express";
import asyncHandler from "express-async-handler";

(async () => {
  dotenv.config();
  await initDb();

  const app = express();
  const port = process.env.PORT;

  app.use(express.json());

  const userController = new UserController(db);
  const blogController = new BlogController(db);
  const spaceController = new SpaceController(db);

  // *Auth Routes
  app.post("/api/v0/signup", asyncHandler(userController.signup));
  app.post("/api/v0/login", asyncHandler(userController.login));

  app.use(requireAuth);

  // *User Routes
  app.get("/api/v0/getUserCard/:id", asyncHandler(userController.getUserCard));
  app.post("/api/v0/followUser/:id", asyncHandler(userController.createFollow));
  app.delete(
    "/api/v0/unFollowUser/:id",
    asyncHandler(userController.deleteFollow),
  );
  app.get(
    "/api/v0/getFollowers/:id",
    asyncHandler(userController.getFollowers),
  );
  app.get("/api/v0/usersList", asyncHandler(userController.getUsersList));
  app.get("/api/v0/getUserCard/:id", asyncHandler(userController.getUserCard));

  // *Blog Routes
  app.post("/api/v0/blog", asyncHandler(blogController.createBlog));
  app.put("/api/v0/blog/:blogId", asyncHandler(blogController.updateBlog));
  app.get("/api/v0/blog/:blogId", asyncHandler(blogController.getBlog));
  app.delete("/api/v0/blog/:blogId", asyncHandler(blogController.deleteBlog));

  // todo: test the following apis after finishing comments and likes apis
  app.get(
    "/api/v0/blogComments/:blogId",
    asyncHandler(blogController.getBlogComments),
  );
  app.get(
    "/api/v0/blogLikes/:blogId",
    asyncHandler(blogController.getBlogLikes),
  );
  app.get(
    "/api/v0/blogLikesList/:blogId",
    asyncHandler(blogController.getBlogLikesList),
  );

  // *Space Routes
  app.post("/api/v0/space", asyncHandler(spaceController.createSpace));
  app.put("/api/v0/space/:spaceId", asyncHandler(spaceController.updateSpace));
  app.get("/api/v0/space/:spaceId", asyncHandler(spaceController.getSpace));
  app.delete(
    "/api/v0/space/:spaceId",
    asyncHandler(spaceController.deleteSpace),
  );

  // todo: create default space for default home page and test the api
  app.get(
    "/api/v0/getDefaultSpace",
    asyncHandler(spaceController.getDefaultSpace),
  );
  app.post(
    "/api/v0/joinSpace/:spaceId",
    asyncHandler(spaceController.joinSpace),
  );
  app.post(
    "/api/v0/addMember/:spaceId",
    asyncHandler(spaceController.addMember),
  );
  app.get(
    "/api/v0/spaceMembers/:spaceId",
    asyncHandler(spaceController.getSpaceMembers),
  );

  app.use(errorHandler);
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
