import express from "express";
import controller from "../controllers/User";
import { ValidateJoi, Schemas } from "../middleware/Joi";

const router = express.Router();

router.post("/login", controller.checkUser);
router.post("/create", ValidateJoi(Schemas.user.create), controller.createUser);
router.get("/get/:userId", controller.readUser);

export = router;