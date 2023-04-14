import express from "express";
import controller from "../controllers/User";
import { ValidateJoi, Schemas } from "../middleware/Joi";

const router = express.Router();

router.post("/login", ValidateJoi(Schemas.user.login), controller.checkUser);
router.post("/create", ValidateJoi(Schemas.user.create), controller.createUser);
router.get("/check/:username", controller.userExist);

export = router;