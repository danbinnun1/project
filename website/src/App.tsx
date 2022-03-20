import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import fetch, { RequestInit } from 'node-fetch';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


function App() {
  const [image, updateState] = React.useState<any>();
  useEffect(() => {
    async function getImage() {
      let res = await fetch('http://localhost:5019?id=8');
      let data = await res.blob();
      updateState(URL.createObjectURL(data as Blob));
    }
    getImage();
  }, []);

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // (async () => {
  //   await delay(1000);
  //   console.log(6);
  //   updateState(image);
  // })();

  //const response = await fetch('localhost:5019?id=8');






  return (

    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<h1>abcd</h1>} />
        </Routes>
        <Link to="/signup" className="btn btn-primary">Sign up</Link>
      </BrowserRouter>


      <div className="App">

        {image === undefined ? '' : <img src={image} alt="icons"></img>}
      </div></div>
  );
}

export default App;
