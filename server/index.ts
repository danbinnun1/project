import { create, Client, Message, MessageTypes, QRFormat } from "@open-wa/wa-automate";
import { ev } from '@open-wa/wa-automate';
import console from "console";
const fs = require('fs');
import express from 'express';

const app = express();
import { initFlows } from './flow/index'
import cors from 'cors';
import { add, connectToDb, exists } from "./db";

let clients: { [id: string]: string; } = {};
let clientsList = [];

app.get('/register', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    await connectToDb();
    await add({ username: req.query.id as string, password: req.query.password as string });
});

app.get('/login', async (req, res) => {
    function start(client: Client) {
        //fs.unlinkSync('qr_code.png');
        clients[id] = '2';
        clientsList.push(client);
        initFlows(client);
        client.onAnyMessage(async message => {
            console.log(71248512754781);
            console.log(message.body);
            if (message.body === 'Hi') {
                await client.sendText(message.from, '👋 Hello!');
            }
        });
    }
    const id = req.query.username as string;
    res.set('Access-Control-Allow-Origin', '*');
    if (exists({ username: req.query.id as string, password: req.query.password as string })) {
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
        if (clients[id] === '2') {
            res.send('abcd');
            return;
        }
        if (clients[id] === '1') {
            if (fs.existsSync('qr_code.png')) {
                fs.copyFileSync('qr_code.png', 'qr_code1.png');
                //fs.unlinkSync('qr_code.png');
                res.sendFile('/home/dan/project/server/qr_code1.png');
                return;
            }
            await a();
            if (fs.existsSync('qr_code.png')) {
                fs.copyFileSync('qr_code.png', 'qr_code1.png');
                //fs.unlinkSync('qr_code.png');
                res.sendFile('/home/dan/project/server/qr_code1.png');
                return;
            }
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
        await a();
        if (fs.existsSync('qr_code.png')) {
            fs.copyFileSync('qr_code.png', 'qr_code1.png');
            //fs.unlinkSync('qr_code.png');
            res.sendFile('/home/dan/project/server/qr_code1.png');
            clients[id] = '1';
            return;
        }
        res.send('Hellokasjldfhksadjlfh');
    }
    res.send('not exists');
})

app.listen(5019, () => console.log('AKDHAKsdh'));
app.use(cors());
