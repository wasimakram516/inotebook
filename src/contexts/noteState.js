import { useState, useEffect } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
  const host = process.env.REACT_APP_HOST;
  const authToken = localStorage.getItem("token");
  const [notes, setNotes] = useState([]);


  // Function to fetch all notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      if (response.ok) {
        const fetchedNotes = await response.json();
        setNotes(fetchedNotes);
      } else {
        // Log status text for better debugging
        console.error("Failed to fetch notes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);

  // Add a new note
  const addNotes = async (newNote) => {
    try {
      const response = await fetch(`${host}/api/notes/addnotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        const addedNote = await response.json();
        setNotes(prev => [...prev, addedNote]);
      } else {
        console.error("Failed to add note:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Update an existing note
  const updateNotes = async (id, updatedNote) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify(updatedNote),
      });

      if (response.ok) {
        // Refresh the notes to reflect the update
        getNotes();
      } else {
        console.error("Failed to update note:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Delete a note
  const deleteNotes = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      if (response.ok) {
        // Refresh the notes to reflect the deletion
        getNotes();
      } else {
        console.error("Failed to delete note:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <noteContext.Provider value={{ notes, addNotes, updateNotes, deleteNotes,getNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
