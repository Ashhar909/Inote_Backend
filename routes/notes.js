const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Notes");
const router = express.Router();
const { body, validationResult } = require("express-validator");


// * Route 1
// fetch all the notes of a particular user
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// * Route 2
// add notes to the user
router.post(
  "/addnote",
  [
    body("title", "enter a title").exists(),
    body("description", "enter bigger description").isLength({ min: 5 }),
  ],
  fetchUser,
  async (req, res) => {
    // get if there are any erros inside errors list
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // destructure the body
      const { title, description, tag } = req.body;

      let note = await Note.create({
        user: req.user.id,
        title: title,
        description: description,
        tag: tag,
      });
      res.json(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


// * Route 3
// update a note
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    // destructure
    const { title, description, tag } = req.body;

    // extract from db
    let noteFromDb = await Note.findOne({ _id: req.params.id });

    // chk if note present
    if (!noteFromDb) {
      return res.status(404).send("Note not Found");
    }

    // ! perform a chk if the user is the same user who has put the notes
    // no one should update anyone elses
    // console.log(noteFromDb.user)
    // * returns a object so use a toString method
    if (noteFromDb.user.toString() !== req.user.id) {
      return res.status(401).send("Access denied");
    }

    let updatedNote = {};
    if (title) {
      updatedNote.title = title;
    }
    if (description) {
      updatedNote.description = description;
    }
    if (tag) {
      updatedNote.tag = tag;
    }

    // write to db
    noteFromDb = await Note.findByIdAndUpdate(
      noteFromDb,
      { $set: updatedNote },
      { new: true }
    );
    res.json(noteFromDb);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// * Route 4
// delete a node
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    let noteFromDb = await Note.findOne({ _id: req.params.id });

    // chk if note present
    if (!noteFromDb) {
      return res.status(404).send("Note not Found");
    }

    // ! perform a chk if the user is the same user who has put the notes
    // no one should update anyone elses
    // console.log(noteFromDb.user)
    // * returns a object so use a toString method
    if (noteFromDb.user.toString() !== req.user.id ) {
      return res.status(401).send("Access denied");
    }

    const userId = req.user.id;
    const noteId = req.params.id;

    await Note.deleteOne({ user: userId, _id: noteId });

    res.json({"Success": " Note has been deleted"});
  
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
    
});

module.exports = router;
