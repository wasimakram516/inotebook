import React, { useContext, useState } from "react";
import noteContext from "../contexts/noteContext";

const AddNotes = () => {
  const { addNotes } = useContext(noteContext);

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    addNotes(note);
    handleClear();
  };

  const handleClear = () => {
    setNote({ title: "", description: "", tag: "" });
  };
  return (
    <div>
      <h2 className="text-center">Add a Note</h2>
      <form onSubmit={handleSaveClick}>
        <div className="mb-3">
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={handleChange}
          />
        </div>
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={note.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={note.description}
            onChange={handleChange}
            rows={3}
            style={{ resize: "none" }}
          />
        </div>
        
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-danger mx-2"
        >
          Clear
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
};

export default AddNotes;
