import console from "console";
import express from 'express';
import { json } from 'body-parser';
const app = express();
import cors from 'cors';
import { add, connectToDb } from "./db/user";
import { addPoll, findByNameAndUsername, getPolls } from "./db/poll";
import { PollData, startPoll } from "./poll";
import { clients, tryLogin } from "./clients_registry";
import { Client, ContactId } from "@open-wa/wa-automate";


app.post('/add_poll', json(), async (req, res) => {
    let poll: PollData = req.body;
    addPoll(poll);
    res.end();
})

app.get('/polls', async (req,res)=>{
    res.set('Access-Control-Allow-Origin', '*');
    let polls = await getPolls(req.query.username as string);
    res.send(polls);
    res.end();
});

app.get('/poll', async (req, res)=>{
    let username: string = req.query.username as string;
    const pollName: string = req.query.name as string;
    const poll = await findByNameAndUsername(pollName, username);
    res.send(poll);
})

app.get('/send_poll', async (req, res) => {
    let username: string = req.query.username as string;
    const pollName: string = req.query.name as string;
    const poll = await findByNameAndUsername(pollName, username);
    startPoll(poll as any,clients[username] as Client);
    res.send("good");
})


app.get('/register', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    await add({ username: req.query.id as string, password: req.query.password as string });
});

app.get('/login', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let qr = await tryLogin(req.query.username as string, req.query.password as string);
    if (!qr) {
        res.send("abcd");
        return;
    }
    res.sendFile(qr as string);
})
connectToDb().then(() => console.log("connected to mongo"));
app.listen(5019, () => console.log('AKDHAKsdh'));
app.use(cors());
