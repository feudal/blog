import { body } from "express-validator";

export const postValidation = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("text")
    .isLength({ min: 3 })
    .withMessage("Text must be at least 3 characters long"),
  body("tags").optional().isArray().withMessage("Tabs must be an array"),
  body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
];
