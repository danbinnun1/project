import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import fetch, { RequestInit } from 'node-fetch';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import UserPage from './UserPage';
import Poll from './PollPage';
import PollCreation from './PollCreation';
import Draggable from 'react-draggable';


function App() {
  return (

    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Register></Register>} />
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/userpage/:username" element={<UserPage></UserPage>}></Route>
          <Route path="poll/:username/:pollName" element={<Poll></Poll>}></Route>
          <Route path='/new_poll/:username' element={<PollCreation></PollCreation>}></Route>
        </Routes>
        <Link to="/signup" className="btn btn-primary">sign</Link>
        <br></br>
        <Link to="/login" className="btn btn-primary">login</Link>
        <br></br>
        <Link to="/userpage/1" className='btn btn-primary' >user</Link>
        <br></br>
        <Link to="/new_poll/1" className='btn btn-primary' >new poll</Link>
      </BrowserRouter>
    </div>
  );
}

export default App;
