import express from "express";
import controller from "../controllers/User";
import { ValidateJoi, Schemas } from "../middleware/Joi";

const router = express.Router();

router.post("/login", ValidateJoi(Schemas.user.login), controller.login);
router.get("/logout/:username", controller.logout);
router.post("/create", ValidateJoi(Schemas.user.create), controller.createUser);
router.get("/check/:username", controller.usernameExist);

export = router;