import Note from "../models/Note.js";

const isOwnedByUser = (note, userId) => {
  if (!note.userId) {
    return false;
  }

  return note.userId.toString() !== userId;
};

const createNotes = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user?.userId || null;

  try {
    const newNotes = new Note({ title, content, userId });
    await newNotes.save();

    res.status(201).json({
      success: true,
      msg: "Note created successfully.",
      data: newNotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = req.user?.userId
      ? await Note.find({ userId: req.user.userId }).sort({ createdAt: -1 })
      : await Note.find({
          $or: [{ userId: { $exists: false } }, { userId: null }],
        }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      msg: "Successfully fetched notes",
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message
    });
  }
};

const getNotesById = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        msg: "Note not found"
      });
    }

    if (note.userId && (!req.user?.userId || isOwnedByUser(note, req.user.userId))) {
      return res.status(403).json({
        success: false,
        msg: "You do not have access to this note",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Successfully fetched note by ID",
      note
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message
    });
  }
};

const upadateNotes = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.userId && (!req.user?.userId || isOwnedByUser(note, req.user.userId))) {
      return res.status(403).json({
        success: false,
        msg: "You do not have permission to update this note",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    res.status(200).json({ msg: "Successfully updated", note: updatedNote });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message
    });
  }
};

const deleteNotes = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ msg: "Note not found" });

    if (note.userId && (!req.user?.userId || isOwnedByUser(note, req.user.userId))) {
      return res.status(403).json({
        success: false,
        msg: "You do not have permission to delete this note",
      });
    }

    await Note.findByIdAndDelete(id);

    res.status(201).json({ msg: "Successfully deleted Note!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message
    });
  }
};

export { createNotes, getNotes, getNotesById, upadateNotes, deleteNotes };
