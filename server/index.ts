import { create, Client, Message, MessageTypes, QRFormat } from "@open-wa/wa-automate";
import { ev } from '@open-wa/wa-automate';
import console from "console";
const fs = require('fs');
import express from 'express';

const app = express();
import { initFlows} from './flow/index'

let clients = {};



let g = 0;
app.get('/', async (req, res) => {
    console.log(1234);
    const id = req.query.id;
    if (fs.existsSync('qr_code.png')) {
        fs.copyFileSync('qr_code.png', 'qr_code1.png');
        fs.unlinkSync('qr_code.png');
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
        //popup: true,
        qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
    }).then(client => start(client));


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
    });




    function start(client: Client) {
        //fs.unlinkSync('qr_code.png');
        initFlows(client);
        client.onAnyMessage(async message => {
            console.log(71248512754781);
            console.log(message.body);
            if (message.body === 'Hi') {
                await client.sendText(message.from, '👋 Hello!');
            }
        });
    }
    res.send('Hellokasjldfhksadjlfh');
})


const port = 4000;
app.listen(5017, () => console.log('AKDHAKsdh'));