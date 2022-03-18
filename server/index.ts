import { create, Client, Message, MessageTypes, QRFormat } from "@open-wa/wa-automate";
import { ev } from '@open-wa/wa-automate';
import console from "console";
const fs = require('fs');
import express from 'express';

const app = express();





let g = 0;
app.get('/', async (req, res) => {
    if (fs.existsSync('qr_code.png')) {
        fs.copyFileSync('qr_code.png', 'qr_code1.png');
        fs.unlinkSync('qr_code.png')
        res.sendFile('/home/dan/project/server/qr_code1.png');
        return;
    }
    create({
        sessionId: "COVID_HELPER",
        multiDevice: true, //required to enable multiDevice support
        authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
        blockCrashLogs: true,
        disableSpins: true,
        headless: true,
        logConsole: false,
        popup: true,
        qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
    }).then(client => start(client));
    let a = (async () => {
        return new Promise(function (resolve, reject) {
            ev.on('qr.**', async qrcode => {
                //qrcode is base64 encoded qr code image
                //now you can do whatever you want with it
                const imageBuffer = Buffer.from(
                    qrcode.replace('data:image/png;base64,', ''),
                    'base64'
                );
                fs.writeFileSync('qr_code.png', imageBuffer);
                console.log(100);
                console.log(200);
                resolve(5)
            });
        })
    });
    console.log(1);
    let b = await a();
    console.log(b);
    console.log(2);
    b = await a();
    console.log(b);
    console.log(3);
    b = await a();

    console.log(b);
    console.log(4);
    b = await a();
    console.log(b);


    function start(client: Client) {
        client.onMessage(async message => {
            console.log(71248512754781);
            if (message.body === 'Hi') {
                await client.sendText(message.from, '👋 Hello!');
            }
        });
    }
    res.send('Hellokasjldfhksadjlfh');
})


const port = 4000;
app.listen(5006, () => console.log('AKDHAKsdh'));