import React from 'react'
import { Link } from "react-router-dom";

export default function Header(props) {
  return (
    <nav className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode === 'light' ? 'light' : 'dark'} shadow-sm`}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fst-italic" to="/">{props.title}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
          {/* THE FIX: Here are your restored navigation links! */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/userinfo">User Info</Link>
            </li>
          </ul>
          
          {/* The Dark Mode Toggle Switch */}
          <div className={`form-check form-switch text-${props.mode === 'light' ? 'dark' : 'light'}`}>
            <input 
              className="form-check-input" 
              type="checkbox" 
              role="switch" 
              id="flexSwitchCheckDefault" 
              onClick={props.toggleMode} 
              style={{ cursor: "pointer" }}
            />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              {props.mode === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'}
            </label>
          </div>

        </div>
      </div>
    </nav>
  );
}