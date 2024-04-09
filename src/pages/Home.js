import React, { useEffect,useContext } from "react";
import Notes from "../components/Notes";
import AddNotes from "../components/AddNotes";
import { useNavigate } from "react-router-dom";
import noteContext from "../contexts/noteContext";
const Home = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
const {getNotes}=useContext(noteContext);
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]); 

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);


  return (
    <>
      <AddNotes />
      <Notes />
    </>
  );
};

export default Home;
