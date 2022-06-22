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
import './css.css';


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
        {(window.location.pathname==='/' || window.location.pathname==='/signup' || window.location.pathname==='/login') && (<div className="top_center">
              <a href="/signup" className="menu_link"><b>sign</b></a>
              {/* <br></br> */}
              <a href="/login" className="menu_link"><b>login</b></a>
              {/* <br></br> */}
              <a href="/userpage/1" className='menu_link' ><b>user</b></a>
              {/* <br></br> */}
              <a href="/new_poll/1" className='menu_link' ><b>new poll</b></a>
              </div>)
        }
        

      </BrowserRouter>
    </div>
  );
}

export default App;
