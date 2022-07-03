import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postValidation,
} from "./validations/index.js";
import { checkAuth, hangleValidationErrors } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(process.env.MONOGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send(" Hello World!");
});
const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post(
  "/auth/register",
  registerValidation,
  hangleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  hangleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getTags);
app.get("/posts/tags/:tag", PostController.getByTag);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postValidation, PostController.update);

app.listen(process.env.POST || 4444, (err) => {
  if (err) {
    console.log(err);
  } else console.log("Server is running on port 4444");
});
