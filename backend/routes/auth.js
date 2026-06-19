import express from "express";

import { login, register } from "../functions/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;