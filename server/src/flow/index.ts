import {
    ChatId,
    Client,
    ContactId,
    Message,
    MessageId,
    MessageTypes,
} from "@open-wa/wa-automate";
import { sendPayloaded } from "./payload";


const selfChat = "17622130901@c.us";
const possibleOptions = 3;

export interface Response {
    response: Message;
    original: MessageId;
    text: string;
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
