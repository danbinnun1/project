import { create, Client, Message, MessageTypes, QRFormat, Content } from "@open-wa/wa-automate";
import { ev } from '@open-wa/wa-automate';
import console from "console";
const fs = require('fs');
import express from 'express';

const app = express();
import { initFlows } from './flow/index'
import cors from 'cors';
import { add, connectToDb, exists } from "./db";



let clients: { [id: string]: Client | string; } = {};


app.get('/register', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    await connectToDb();
    await add({ username: req.query.id as string, password: req.query.password as string });
});

app.get('/login', async (req, res) => {
    const id = req.query.username as string;
    function start(client: Client) {
        clients[id] = client;
        initFlows(client);
        client.onAnyMessage(async message => {
            console.log(71248512754781);
            console.log(message.body);
            if (message.body === 'Hi') {
                await client.sendText(message.from, '👋 Hello!');
            }
        });
    }
    res.set('Access-Control-Allow-Origin', '*');
    if (exists({ username: req.query.id as string, password: req.query.password as string })) {
        let getQrCode = (async () => {
            return new Promise(function (resolve, reject) {
                ev.on('qr.**', async (qrcode, sessionId) => {
                    const imageBuffer = Buffer.from(
                        qrcode.replace('data:image/png;base64,', ''),
                        'base64'
                    );
                    fs.writeFileSync(`qr_code_${sessionId}.png`, imageBuffer);
                    resolve(5);
                });
            })
        });

        if (clients[id] === 'loading') {
            res.sendFile(`/home/dan/project/server/qr_code_${id}.png`);
            return;
        }

        if (clients[id] !== undefined) {
            res.send('abcd');
            return;
        }

        create({
            multiDevice: true, //required to enable multiDevice support
            authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
            blockCrashLogs: true,
            disableSpins: true,
            headless: true,
            logConsole: false,
            //popup: true,
            qrTimeout: 0,
            sessionId: id,
        }).then(client => start(client));
        await getQrCode();
        clients[id] = 'loading';
        res.sendFile(`/home/dan/project/server/qr_code_${id}.png`);
        return;
    }
    res.send('not exists');
})

app.listen(5019, () => console.log('AKDHAKsdh'));
app.use(cors());
