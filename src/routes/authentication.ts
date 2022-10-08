import { Router } from "express";
// import {validateToken} from '../middleware/authJwt';
import {
  loginController,
  registerController,
} from "../controller/auth.controller";

const router = Router();

router.post("/login", loginController);

router.post("/register", registerController);

export default router;
