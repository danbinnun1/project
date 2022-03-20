import React, { useEffect } from 'react';
import fetch from 'node-fetch';



function Qr(props: any) {
    const [image, updateState] = React.useState<any>();
    useEffect(() => {
        async function getImage() {
            if (props.username ===  undefined){
                updateState('');
                return;
            }
            let res = await fetch('http://localhost:5019/login?username=' + props.username + '&password=' + props.password);
            let data = await res.blob();
            updateState(URL.createObjectURL(data as Blob));
        }
        getImage();
    }, [props, image]);
    useEffect(() => {
        setInterval(() => {
            updateState(image);
        }, 1000);
    }, []);

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    //const response = await fetch('localhost:5019?id=8');


    return (
        <div className="App">
            {image === undefined ? '' : <img src={image} alt="icons"></img>}
        </div>
    );
}

export default Qr;
