import { Router } from "express";
import { body, param } from "express-validator";
import { DataSourceController } from "../controllers/DataSourceController";
import { authorized, authorizedRefresh } from "../middleware/authenticated";
import { validateRequest } from "../middleware/validator";

const router = Router();
const dataSourceController = new DataSourceController();

router.post(
  "/",
  authorized,
  validateRequest([
    body("name").exists().withMessage("Name is required"),
    body("type").exists().withMessage("Type is required"),
    body("db_host")
      .exists()
      .withMessage("Host is required")
      .isURL()
      .withMessage("Enter a valid hostname"),
    body("db_port")
      .exists()
      .withMessage("Port is required")
      .isPort()
      .withMessage("Enter a valid port"),
    body("db_name").exists().withMessage("Database Name is required"),
    body("db_user").exists().withMessage("Database User is required"),
    body("db_password").exists().withMessage("Database Password is required"),
  ]),
  dataSourceController.create
);

router.get("/", authorized, dataSourceController.queries);

router.put(
  "/:id",
  authorized,
  validateRequest([
    param("id").exists().withMessage("ID is missing"),
    body("name").exists().withMessage("Name is required"),
    body("type").exists().withMessage("Type is required"),
    body("db_host")
      .exists()
      .withMessage("Host is required")
      .isURL()
      .withMessage("Enter a valid hostname"),
    body("db_port")
      .exists()
      .withMessage("Port is required")
      .isPort()
      .withMessage("Enter a valid port"),
    body("db_name").exists().withMessage("Database Name is required"),
    body("db_user").exists().withMessage("Database User is required"),
    body("db_password").exists().withMessage("Database Password is required"),
  ]),
  dataSourceController.update
);

router.delete(
  "/:id",
  authorized,
  validateRequest([
    param("id").exists().withMessage("ID is missing"),
  ]),
  dataSourceController.delete
)

export default router;
