import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { authorized } from "../middleware/authenticated";
import { validateRequest } from "../middleware/validator";

const router = Router();
const authController = new AuthController();

router.post('/register', validateRequest([
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ max: 30, min: 8 }).withMessage('Password must be between 8 and 30 characters long')
]), authController.register);

router.post('/login', validateRequest([
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ max: 30, min: 8 }).withMessage('Password must be between 8 and 30 characters long')
]), authController.login);

router.get('/currentUser', authorized, authController.currentUser);

export default router;