import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { authorized, authorizedRefresh } from "../middleware/authenticated";
import { validateRequest } from "../middleware/validator";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validateRequest([
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ max: 30, min: 8 })
      .withMessage("Password must be between 8 and 30 characters long")
      .isStrongPassword()
      .withMessage(
        "Password must be at least 8 characters long and contain at least one number, one special character and one uppercase letter"
      ),
  ]),
  authController.register
);

router.post(
  "/login",
  validateRequest([
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ max: 30, min: 8 })
      .withMessage("Password must be between 8 and 30 characters long"),
  ]),
  authController.login
);

router.post(
  "/refresh",
  validateRequest([body("refreshToken")]),
  authorizedRefresh,
  authController.refresh
);

router.get("/currentUser", authorized, authController.currentUser);

export default router;
