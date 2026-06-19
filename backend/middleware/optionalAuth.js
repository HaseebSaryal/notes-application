import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "notes-app-secret";

const optionalAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: payload.userId,
      username: payload.username,
    };
  } catch {
    req.user = null;
  }

  next();
};

export default optionalAuth;