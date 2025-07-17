const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Makes title required
  // Removes leading/trailing spaces
  },
  content: {
    type: String,
    required: true,

  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
