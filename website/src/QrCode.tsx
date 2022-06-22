import React, { useEffect, useState } from 'react';
import fetch from 'node-fetch';
import  { Navigate } from 'react-router-dom'



function Qr(props: any) {
    const [image, updateState] = React.useState<any>();
    const [b, setB]=React.useState(0);
    const [finished, setFinished]=useState(false);
    useEffect(() => {
        async function getImage() {
            if (props.username ===  undefined){
                updateState('');
                return;
            }
            let res = await fetch('http://localhost:5019/login?username=' + props.username + '&password=' + props.password);
            // if ((await res.text())==='abcd'){
            //     return <Navigate to='/register'></Navigate>
            // }
            if (res.headers.get('Content-Type')!=='image/png'){
                setFinished(true);
            }

            let data = await res.blob();
            updateState(URL.createObjectURL(data as Blob));
        }
        getImage();
    }, [props, image, b]);
    useEffect(() => {
        const interval = setInterval(() => {
            setB(b);
        }, 10000);
        return () => clearInterval(interval);

    }, []);

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    //const response = await fetch('localhost:5019?id=8');
    if (finished){
        return <Navigate to={'/userpage/'+props.username}></Navigate>
    }

    return (
        <div className="App">
            {image === undefined ? '' : <img src={image} alt=""></img>}
        </div>
    );
}

export default Qr;
