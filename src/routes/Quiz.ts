import express from "express";
import controller from "../controllers/Quiz";
import { ValidateJoi, Schemas } from "../middleware/Joi";

const router = express.Router();

router.post("/create", ValidateJoi(Schemas.quiz.create), controller.createQuiz);
router.get("/get/:id", controller.getQuiz);
router.patch("/update/:id", controller.updateQuiz);
router.delete("/delete/:id", controller.deleteQuiz);

export = router;