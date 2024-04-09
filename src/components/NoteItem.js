import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import noteContext from "../contexts/noteContext";

const NoteItem = (props) => {
  const { deleteNotes, updateNotes } = useContext(noteContext);
  const { id, title, description, tag } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState({
    id:"",
    title: "",
    description: "",
    tag: "",
  });

  const handleEditClick = () => {
    setModalOpen(true);
    setNote({id,title,description,tag});
  };

  const handleClose = () => {
    setModalOpen(false);
    setNote({ id:"",title: "",
    description: "",
    tag: "",})
  };

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    updateNotes(id, note); // Where `note` is { title, description, tag }

    setModalOpen(false);
  };


  const handleDeletetClick = () => {
    deleteNotes(id);
  };

  return (
    <>
      <div className="card col-md-3 mx-2 my-2">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between flex-nowrap">
            <h5 className="card-title">{title}</h5>

            <p style={{ color: "red" }}>{tag}</p>

            <div>
              <button className="btn p-0 mx-1" onClick={(handleEditClick)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              <button className="btn p-0 mx-1" onClick={handleDeletetClick}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          </div>
          <p className="card-text">{description}</p>
        </div>
      </div>

      {modalOpen && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Edit Note</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose}
                  ></button>
                </div>
                <div className="modal-body">
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
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <button type="button" onClick={handleSaveClick} className="btn btn-primary">
                    Update Note
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default NoteItem;
