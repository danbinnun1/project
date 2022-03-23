import { Client, ContactId, MessageTypes } from "@open-wa/wa-automate";
import { awaitResponse } from "./flow";

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

export interface PollData {
    poll: Poll,
    username: string,
    name: string,
    recepients: ContactId[],
    submissions: { [username: string]: string[] }
}

export async function startPoll(pollData: PollData, client: Client) {
    const poll = pollData.poll;
    for (let recepient of pollData.recepients) {
        let current = poll.start;
        let path = [current];
        while (true) {
            const response = await awaitResponse(client,
                recepient,
                recepient,
                undefined,
                "abcd",
                MessageTypes.BUTTONS_RESPONSE,
                undefined, undefined,
                poll.edges[current].map(edge => edge.question),
                current);
            let selected = poll.edges[current].filter(edge => edge.question === response.text)[0];
            current = selected.to;
            path.push(current);
            if (!poll.edges[current] || poll.edges[current].length === 0) {
                await client.sendText(recepient, current);
                break;
            }
        }

    }
    //return path;
}
