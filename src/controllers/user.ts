import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { hash, compare } from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../utils/validateEnv";
import UserModel from "../models/user";

export const registerUser: RequestHandler = async (req, res, next) => {
  const Username = req.body.username;
  const Email = req.body.email;
  const Password = req.body.password;
  const ProfileImage = req.body.profileImage;
  try {
    if (!Username || !Email || !Password || ProfileImage) {
      throw createHttpError(404, "Bad Request");
    }
    const exitEmail = await UserModel.findOne({ email: Email });

    if (exitEmail) {
      throw createHttpError(500, "This email already exist");
    }

    const encryptPassword = await hash(Password, 10);

    const user = await UserModel.create({
      username: Username,
      email: Email,
      password: encryptPassword,
      profileImage: ProfileImage,
    });

    const token = jwt.sign({ user: user }, env.JWT_TOKEN, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ user: user }, env.JWT_TOKEN, {
      expiresIn: "7d",
    });

    res.status(200).json({ user, token, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({ email: email })
      .select("+password")
      .exec();

    if (!user) {
      throw createHttpError(500, "Invalid credential");
    }

    const passwordMatch = await compare(password, user.password!);

    if (!passwordMatch) {
      throw createHttpError(500, "Invalid credential");
    }

    const accessToken = jwt.sign({ user: user }, env.JWT_TOKEN, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ user: user }, env.JWT_TOKEN, {
      expiresIn: "7d",
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        accessToken,
        refreshToken,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
      });
  } catch (error) {
    next(error);
  }
};

export const getUserByName: RequestHandler = async (req, res, next) => {
  try {
    const name = req.body.name;

    let users: unknown[] = [];
    if (name === "") {
      users = [];
    } else {
      users = await UserModel.find({
        username: { $regex: `^${name}`, $options: "i" },
      });
    }
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }
    const decoded = jwt.verify(refreshToken, env.JWT_TOKEN) as JwtPayload;
    const accessToken = jwt.sign({ user: decoded.user }, env.JWT_TOKEN, {
      expiresIn: "1h",
    });
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
