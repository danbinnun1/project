import React, { useEffect } from 'react';
import fetch from 'node-fetch';



function Qr() {
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
      <div className="App">
        {image === undefined ? '' : <img src={image} alt="icons"></img>}
      </div>
  );
}

export default Qr;
