import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
  SALT_ROUNDS,
  PASSWORD_LENGTH,
  SECRET_KEY,
  EXPIRED_IN,
} from "../constants/app";
import User from "../ models/User";
import Logging from "../library/logging";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (err) {
          Logging.error(err.message);
          return res.status(500).send({ message: "Internal server error" });
        } else if (response) {
          return res.status(200).send({
            token: jwt.sign({ email }, SECRET_KEY, {
              expiresIn: EXPIRED_IN,
            }),
          });
        }
      });
    } else {
      return res.status(400).send({ message: "User is not found" });
    }
  } catch (err) {
    Logging.error(err);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const registerController = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      sex,
      birthday,
      email,
      password,
      confirmPassword,
    } = req.body;

    const validUserCond = [
      {
        cond: ![email, password, confirmPassword].every(Boolean),
        message: "Email, Password are required",
      },
      {
        cond: password !== confirmPassword,
        message: "Password was not match",
      },
      {
        cond: password.length < PASSWORD_LENGTH,
        message: "Password is not strong enough",
      },
    ];

    const errorFound = validUserCond.find((cond) => cond.cond);
    if (errorFound) {
      return res.status(400).send(errorFound.message);
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ message: "Email is already used" });
    }

    bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
      if (err) {
        throw new Error("Internal serer error");
      }

      const newUser = new User({
        birthday,
        firstName,
        lastName,
        email,
        sex,
        password: hash,
      });

      newUser.save((err, user) => {
        if (err) {
          throw new Error(err.message);
        }

        return res.status(200).send({
          user: {
            birthday: user.birthday,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            sex: user.sex,
          },
        });
      });
    });
  } catch (err) {
    Logging.error(err);
    return res.status(500).send({ message: "Internal serer error" });
  }
};
