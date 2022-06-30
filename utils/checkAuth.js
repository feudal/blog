import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret");

      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }
  } else {
    return res.status(403).json({
      message: "Access denied. No token provided.",
    });
  }
};
