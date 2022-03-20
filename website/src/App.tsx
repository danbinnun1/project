import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import fetch, { RequestInit } from 'node-fetch';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Form from './Register';


function App() {
  return (

    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Form></Form>} />
        </Routes>
        <Link to="/signup" className="btn btn-primary">sign</Link>
      </BrowserRouter>
    </div>
  );
}

export default App;
