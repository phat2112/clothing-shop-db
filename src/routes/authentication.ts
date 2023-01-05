import { Router } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants/app";
// import {validateToken} from '../middleware/authJwt';
import {
  loginController,
  registerController,
} from "../controller/auth.controller";
import User from "../ models/User";
import Logging from "../library/logging";

const router = Router();

router.post("/login", loginController);

router.post("/register", registerController);

router.post("/current-user", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new Error("Token is not supplied");
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    if (typeof decoded !== "string") {
      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          birthday: user.birthday,
          sex: user.sex,
        },
      });
    }

    throw new Error("token decoded failed");
  } catch (error) {
    Logging.error(error);

    return res.status(500).send({ data: "Internal server error" });
  }
});

export default router;
