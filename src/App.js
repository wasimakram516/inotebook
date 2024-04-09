import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Home from "./pages/Home";
import NoteState from "./contexts/noteState";
import Login from "./components/Login";
import Signup from "./components/Signup";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <NoteState>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login/>} />
              <Route exact path="/signup" element={<Signup />} />
            </Routes>
          </NoteState>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
