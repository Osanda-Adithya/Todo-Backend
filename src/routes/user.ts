import express from "express";
import * as User from "../controllers/user";
import { verifyedUser } from "../middleware/verfied_user";

const router = express.Router();

router.post("/register", User.registerUser);

router.post("/login", User.login);

router.post("/getuser", verifyedUser, User.getUserByName);

router.post("/refreshtoken", User.refreshToken);

export default router;
