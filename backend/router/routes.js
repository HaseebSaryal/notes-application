const express = require("express");
const router = express.Router();
const { createNotes, getNotes, deleteNotes,upadateNotes,getNotesById } = require("../functions/controllers")

router.post("/notes", createNotes);
router.get("/notes/:id", getNotesById);
router.get("/notes", getNotes);
router.put("/notes/:id", upadateNotes);
router.delete("/notes/:id", deleteNotes);

module.exports = router;
