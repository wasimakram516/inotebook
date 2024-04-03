const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1: Add new notes using POST: "/api/notes/addnotes". Login Required
router.post(
  "/addnotes",
  [
    // Validation middleware to ensure that the request body contains valid data
    body("title", "Enter a valid title.").isLength({ min: 3 }),
    body("description", "Enter a valid description.").isLength({ min: 5 }),
  ],
  fetchUser,
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await notes.save();
      res.json(savedNotes);
    } catch (error) {
      // Log and send server errors
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Route 2: Get all the notes using GET: "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
    
  } catch (error) {
    // Log and send server errors
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Route 3: Update notes using PUT: "/api/notes/updatenotes/id". Login Required
router.put(
    "/updatenotes/:id",
    [
      // Validation middleware to ensure that the request body contains valid data
      body("title", "Enter a valid title.").isLength({ min: 3 }),
      body("description", "Enter a valid description.").isLength({ min: 5 }),
    ],
    fetchUser,
    async (req, res) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { title, description, tag } = req.body;
        const updatedNotes={};
        if (title) {updatedNotes.title=title};
        if (description) {updatedNotes.description=description};
        if (tag) {updatedNotes.tag=tag};

        let note= await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found!");
        }

        if (note.user.toString()!==req.user.id) {
            return res.status(401).send("Un-authorized!");
        }

        note= await Notes.findByIdAndUpdate(req.params.id,{$set:updatedNotes},{new:true});
        res.json(note);
      } catch (error) {
        // Log and send server errors
        console.error(error.message);
        res.status(500).send("Server error");
      }
    }
  );

  // Route 4: Delete notes using DELETE: "/api/notes/deletenotes/id". Login Required
router.delete(
    "/deletenotes/:id",
    fetchUser,
    async (req, res) => {
      
      try {
        let note= await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found!");
        }

        if (note.user.toString()!==req.user.id) {
            return res.status(401).send("Un-authorized!");
        }

        note= await Notes.findByIdAndDelete(req.params.id);
        return res.json({"Success":"Deleted Successfully!"});
      } catch (error) {
        // Log and send server errors
        console.error(error.message);
        res.status(500).send("Server error");
      }
    }
  );
module.exports = router;
