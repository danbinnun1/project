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
        {(window.location.pathname==='/') && (<div>
              <a href="/signup" className="btn btn-primary">sign</a>
              <br></br>
              <a href="/login" className="btn btn-primary">login</a>
              <br></br>
              <a href="/userpage/1" className='btn btn-primary' >user</a>
              <br></br>
              <a href="/new_poll/1" className='btn btn-primary' >new poll</a>
              </div>)
        }
        

      </BrowserRouter>
    </div>
  );
}

export default App;
