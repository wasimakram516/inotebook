const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const errorHandler = require("../utils/errorHandler");

const router = express.Router();

const noteValidationRules = [
  body("title", "Enter a valid title.").isLength({ min: 1 }),
  body("description", "Description must be at least 5 characters long.").isLength({ min: 1 }),
];

router.post("/addnotes", [noteValidationRules, fetchUser], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorHandler(res, 400, errors.array().map(err => err.msg).join('. '));
  }

  try {
    const { title, description, tag } = req.body;
    const note = new Notes({ title, description, tag, user: req.user.id });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    errorHandler(res, 500, "Failed to add note.");
  }
});

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    errorHandler(res, 500, "Failed to fetch notes.");
  }
});

router.put("/updatenotes/:id", [noteValidationRules, fetchUser], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorHandler(res, 400, errors.array().map(err => err.msg).join('. '));
  }

  try {
    const { title, description, tag } = req.body;
    let note = await Notes.findById(req.params.id);
    if (!note) return errorHandler(res, 404, "Note not found.");
    if (note.user.toString() !== req.user.id) return errorHandler(res, 401, "Unauthorized.");

    const updatedNote = await Notes.findByIdAndUpdate(req.params.id, { $set: { title, description, tag }}, { new: true });
    res.json(updatedNote);
  } catch (error) {
    errorHandler(res, 500, "Failed to update note.");
  }
});

router.delete("/deletenotes/:id", fetchUser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) return errorHandler(res, 404, "Note not found.");
    if (note.user.toString() !== req.user.id) return errorHandler(res, 401, "Unauthorized.");

    await Notes.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully." });
  } catch (error) {
    errorHandler(res, 500, "Failed to delete note.");
  }
});

module.exports = router;
