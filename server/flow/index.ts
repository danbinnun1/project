export interface Edge {
    question: string,
    to: string,
    category?: number
}

export interface Poll {
    start: string,
    vertexes: string[],
    edges: { [from: string]: Edge[] }
}


import {
    ChatId,
    Client,
    Contact,
    ContactId,
    Message,
    MessageId,
    MessageTypes,
} from "@open-wa/wa-automate";
import fs from "fs";
import path from "path";
import { Page } from "puppeteer";
import { sendPayloaded, writePayload } from "./payload";

const selfChat = "17622130901@c.us";
const possibleOptions = 3;

export interface Response {
    response: Message;
    original: MessageId;
    text: string;
}

export interface FlowOptions {
    aliasWithDollar?: boolean;
    identifier: string;
    privateOnly: boolean;
    memberOnly: boolean;
    aliases?: string[];
    name?: string;
    usage?: string;
    description?: string;
}

export interface RegisteredFlow {
    options: FlowOptions;
    flow: Flow;
}

interface FlowStore {
    flows: RegisteredFlow[];
}

interface FlowData {
    content: string;
    quoted?: Message;
    contact: Contact;
    messageId: MessageId;
    groupId: ChatId;
}

const flowStore: { [username: string]: FlowStore } = {};

export const polls: { [username: string]: { [name: string]: Poll } } = {};

export function addPoll(username: string, pollName: string, poll: Poll) {
    if (!polls[username]) {
        polls[username] = {};
    }
    polls[username][pollName] = poll;
}

export type AskCall = (
    content: string,
    type: MessageTypes,
    check?: (message: Message) => boolean,
    error?: string,
    buttons?: string[],
    title?: string,
    footer?: string,
    buttonIdPayload?: string
) => Promise<Response>;

export type Flow = (
    error: (content: string) => Promise<void>,
    send: (
        content: string,
        privately?: boolean,
        payload?: any,
        withoutReply?: boolean
    ) => Promise<MessageId>,
    ask: AskCall,
    data: FlowData,
    args: string[]
) => void;

export function getFlows() {
    return flowStore.flows;
}

export async function sendResponse(
    client: Client,
    messageId: MessageId | boolean | undefined,
    chatId: ChatId,
    content: string,
    payload?: {},
): Promise<MessageId> {
    console.log(content);
    if (payload) {
        await sendPayloaded(content, payload, chatId, client);
        return (await client.getAllMessagesInChat(chatId, true, true)).pop()!.id;
    }

    return (await client.sendText(chatId, content)) as MessageId;
}

export async function awaitResponse(
    client: Client,
    chatId: ChatId,
    userId: ContactId,
    messageId: MessageId | undefined,
    content: string,
    type: MessageTypes,
    check?: (message: Message) => boolean,
    error?: string,
    buttons?: string[],
    title?: string,
    footer?: string,
    buttonIdPayload?: string
): Promise<Response> {
    let sentId: MessageId[] = [];
    if (buttons) {
        let messagesTosend = Math.ceil(buttons.length / possibleOptions);
        sentId.push(
            (await client.sendButtons(
                chatId,
                content,
                buttons.splice(0, possibleOptions).map((button, i) => {
                    return {
                        text: button,
                        id: buttonIdPayload ?? i + "djfkghlskdjfh",
                    };
                }),
                title!,
                footer
            )) as MessageId
        );
        messagesTosend--;
        while (messagesTosend !== 0) {
            sentId.push(
                (await client.sendButtons(
                    chatId,
                    "עוד אופציות:",
                    buttons.splice(0, possibleOptions).map((button, i) => {
                        return {
                            text: button,
                            id: buttonIdPayload ?? i + "djfkghlskdjfh",
                        };
                    }),
                    title!,
                    footer
                )) as MessageId
            );
            messagesTosend--;
        }
    } else {
        const message = await sendResponse(
            client,
            type === MessageTypes.TEXT ? messageId : undefined,
            chatId,
            content
        );
        sentId.push(message);
    }
    const collector = client.createMessageCollector(
        chatId,
        (received: Message) =>
            received.type === type &&
            !!received.quotedMsg &&
            received.sender.id === userId &&
            sentId.includes(received.quotedMsg.id),
        {}
    );

    return await new Promise((resolve) => {
        collector.on("collect", (collected: Message) => {
            console.log("Collected message with id " + collected.id);

            if (check && !check(collected)) {
                if (!error) {
                    error = "קלט לא תקין אנא נסה שוב";
                }
                sendError(client, collected, error);
            } else {
                collector.stop();
                resolve({
                    response: collected,
                    original: sentId[0],
                    text: collected.content,
                });
            }
        });
    });
}

export async function sendError(
    client: Client,
    message: Message,
    error: string
) {
    await client.reply(message.chatId, `⚠️ ${error}`, message.id);
}

export const registerFlow = (options: FlowOptions, flow: Flow, username: string) => {
    if (flowStore[username] === undefined) {
        flowStore[username] = { flows: [] };
    }
    flowStore[username].flows.push({
        flow,
        options: Object.assign(
            {
                aliasWithDollar: true,
                memberOnly: false,
                privateOnly: false,
                aliases: [],
                identifier: "",
                name: "",
                usage: "",
                description: "",
            } as FlowOptions,
            options
        ),
    });
};

import flow from './flows/test.flow';

export function initFlows(client: Client, username: string) {
    if (!client) return;

    const normalizedPath = path.join(__dirname, "flows");

    registerFlow({
        memberOnly: false,
        privateOnly: false,
        identifier: "פינג",
        description: "פקודת בדיקה",
        name: "בדיקה",
    },
        flow, '1');


    client.onAnyMessage((message: Message) => {
        recieveFlow(message, client, username);
        console.log(message);
    });
}

function isFlow(flow: RegisteredFlow, message: Message) {
    const start = `${flow.options.identifier}`;
}

export async function startPoll(recepient: ContactId, poll: Poll, client: Client) {
    let current = poll.start;
    let path = [current];
    while (true) {
        await client.sendText(recepient, current);
        const response = await awaitResponse(client,
            recepient,
            recepient,
            undefined,
            current,
            MessageTypes.BUTTONS_RESPONSE,
            undefined, undefined,
            poll.edges[current].map(edge => edge.question),
            'abcd');
        let selected = poll.edges[current].filter(edge => edge.question === response.text)[0];
        current = selected.to;
        path.push(current);
        if (!poll.edges[current] || poll.edges[current].length === 0) {
            break;
        }
    }
    return path;
}

async function recieveFlow(message: Message, client: Client, username: string) {
    if (
        message.type !== MessageTypes.TEXT &&
        message.type != MessageTypes.BUTTONS_RESPONSE
    )
        return;

    const [identifier, ...args] = message.content.split(" ");

    const found = flowStore[username].flows.find(
        (flow) =>
            `$${flow.options.identifier}` === identifier ||
            (flow.options.aliases &&
                flow.options.aliases.some(
                    (alias) =>
                        `${flow.options.aliasWithDollar ? "$" : ""}${alias}` === identifier
                ))
    );
    if (!found) return;
    // this means we found the flow, we can now error.
    const { options, flow } = found;
    if (options.privateOnly && message.isGroupMsg) {
        sendError(client, message, `אפשר להשתמש בפקודה זאת רק בפרטי`);
        return;
    }



    let lastMessageId = message.id;

    flow(
        async (content) => await sendError(client, message, content),
        async (content, privately = false, payload, withoutReply) =>
        (lastMessageId = await sendResponse(
            client,
            withoutReply ? false : lastMessageId,
            privately ? message.sender.id : message.chatId,
            content,
            payload
        )),
        async (
            content,
            type,
            check,
            error,
            buttons,
            title,
            footer,
            buttonIdPayload
        ) => {
            console.log('lslslslslslslslsls');
            console.log(content);
            const response = await awaitResponse(
                client,
                message.chatId,
                message.sender.id,
                message.type === MessageTypes.TEXT ? lastMessageId : undefined,
                content,
                type,
                check,
                error,
                buttons,
                title,
                footer,
                buttonIdPayload
            );
            lastMessageId = response.response.id;
            return response;
        },
        {
            quoted: message.quotedMsg,
            content: message.content,
            contact: message.sender,
            messageId: message.id,
            groupId: message.chatId,
        },
        args
    );
}
