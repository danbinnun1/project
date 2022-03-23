import { Client, create, ev } from "@open-wa/wa-automate";
import { exists } from "./db/user";
const fs = require('fs');

export let clients: { [id: string]: Client | string; } = {};

export async function tryLogin(username: string, password: string): Promise<string | undefined> {
    function start(client: Client) {
        clients[username] = client;
    }
    if (exists({ username, password })) {
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

        if (clients[username] === 'loading') {
            return `/home/dan/project/server/qr_code_${username}.png`;
        }

        if (clients[username] !== undefined) {
            return;
        }

        create({
            multiDevice: true, //required to enable multiDevice support
            authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
            blockCrashLogs: true,
            disableSpins: true,
            headless: true,
            logConsole: false,
            qrTimeout: 0,
            sessionId: username,
        }).then(client => start(client));
        await getQrCode();
        clients[username] = 'loading';
        return `/home/dan/project/server/qr_code_${username}.png`;
    }
}