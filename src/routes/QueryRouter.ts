import { Router } from "express";
import { body } from "express-validator";
import { QueryController } from "../controllers/QueryController";
import { authorized } from "../middleware/authenticated";
import { validateRequest } from "../middleware/validator";

const router = Router();
const queryController = new QueryController();

export default router;
