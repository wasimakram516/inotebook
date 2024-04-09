import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const host = process.env.REACT_APP_HOST;

  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setCredentials({ email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API Call
      const url = `${host}/api/auth/login`;
      console.log(credentials);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      if (response.ok) {
        // If the response is successful
        const data = await response.json();
        localStorage.setItem("token", data.authToken);

        navigate("/"); // Navigate to home page
      } else {
        // If the response is not successful, handle it accordingly
        console.error("Failed to login: ", response.statusText);
        alert("Wrong credentials!");
      }
    } catch (error) {
      
      console.error("Error to login: ", error);
      alert("Error to login: ", error);
    }
  };


  return (
    <div className="container">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            required
            type="email"
            value={credentials.email}
            onChange={handleChange}
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>Don't have an account?</span>
          <Link
            to="/signup"
            style={{ marginLeft: "5px", textDecoration: "none" }}
          >
            Signup
          </Link>
        </div>

        <button
          className="btn btn-danger mx-2"
          onClick={handleClear}
          type="button"
        >
          Clear
        </button>

        <button type="submit" className="btn btn-primary my-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
