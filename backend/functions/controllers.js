const Note = require("../models/Note");

const createNotes = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNotes = new Note({ title, content });
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
      error: error.message // Optional: helpful for debugging
    });
  }
};

const getNotes = async (_ , res) => {
  try {
    const notes = await Note.find().sort({createdAt: -1});
    res.status(200).json({
      success: true,
      msg: "Successfully fetched notes",
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message // Optional: good for debugging
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

    res.status(200).json({
      success: true,
      msg: "Successfully fetched note by ID",
      note: note
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message
    });
  }
};




const upadateNotes = async(req, res)=>{
    const {id} = req.params
    const{title, content} = req.body;
    try {
        const notes = await Note.findByIdAndUpdate(id, {title ,content}, {new:true})
        if(!notes) return res.status(404).json({message:"note nor found"});
        res.status(200).json({msg:"successfully updated", note:notes})

        
    } catch (error) {
        res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message // Optional: good for debugging
    });
        
        
    }
}
const deleteNotes = async(req,res)=>{
  const {id} = req.params;
  try {
   const notes =  await Note.findByIdAndDelete(id)
   if(!notes) return res.status(404).json({msg:"Note not found"});
    res.status(201).json({msg:"successfully delted Note!"})
    
  } catch (error) {
        res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message // Optional: good for debugging
    }
)}}






module.exports = { createNotes, getNotes, getNotesById, upadateNotes , deleteNotes};
