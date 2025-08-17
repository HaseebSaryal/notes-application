import express from "express";
import {
  createNotes,
  getNotes,
  deleteNotes,
  upadateNotes,
  getNotesById
} from "../functions/controllers.js";

const router = express.Router();

router.post("/notes", createNotes);
router.get("/notes/:id", getNotesById);
router.get("/notes", getNotes);
router.put("/notes/:id", upadateNotes);
router.delete("/notes/:id", deleteNotes);

export default router;
