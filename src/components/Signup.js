import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const host = process.env.REACT_APP_HOST;

  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name:"" ,email: "", password: "", confirmPassword:"" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setCredentials({ name:"",email: "", password: "", confirmPassword:"" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password, confirmPassword}=credentials;
    if (password!==confirmPassword) {
      alert("Passwords don't match!");
      setCredentials({password:"",confirmPassword:""});
      return;
    }
    try {
      // API Call
      const url = `${host}/api/auth/createuser`;
      console.log(credentials);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:name,
          email: email,
          password: password,
        }),
      });
      console.log(JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      }));
      
      if (response.ok) {
        // If the response is successful
        const data = await response.json(); // Convert the response to JSON
        localStorage.setItem("token", data.authToken); // Assuming the server responds with an object that has authToken

        navigate("/");
      } else {
        // If the response is not successful, handle it accordingly
        console.error("Failed to signup: ", response.statusText);
        alert("Failed to signup: ", response.statusText);
      }
    } catch (error) {
      // Catch and handle any errors that occurred during the fetch operation
      console.error("Error to signup: ", error);
      alert("Error to signup: ", error);
    }
  };
  return (
    <div className="container">
      <h2 className="text-center">Create an Account</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            required
            minLength={5}
            type="name"
            value={credentials.name}
            onChange={handleChange}
            name="name"
            className="form-control"
            id="name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            required
            type="email"
            value={credentials.email}
            onChange={handleChange}
            name="email"
            className="form-control"
            id="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            required
            minLength={8}
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="form-control"
            id="password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            required
            minLength={8}
            type="password"
            name="confirmPassword"
            value={credentials.confirmPassword}
            onChange={handleChange}
            className="form-control"
            id="confirmPassword"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>Already have an account?</span>
          <Link
            to="/login"
            style={{ marginLeft: "5px", textDecoration: "none" }}
          >
            Login
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
          Signup
        </button>
      </form>
    </div>
  )
}

export default Signup
