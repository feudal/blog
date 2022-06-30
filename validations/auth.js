import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("fullName")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long"),
  body("avatarUrl").optional().isURL().withMessage("Avatar URL must be valid"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long"),
];
