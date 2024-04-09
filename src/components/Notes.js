import React, { useContext, useEffect } from "react";
import noteContext from "../contexts/noteContext";
import NoteItem from "./NoteItem";

const Notes = () => {
  const { notes, getNotes } = useContext(noteContext);

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="row">
      <h2 className="my-2 text-center">Your Notes</h2>
      {notes.length > 0 ? (
        notes.map((note) => (
          <NoteItem
            key={note._id}
            id={note._id}
            title={note.title}
            description={note.description}
            tag={note.tag}
          />
        ))
      ) : (
        <p className="text-center">No notes to display.</p>
      )}
    </div>
  );
};

export default Notes;
