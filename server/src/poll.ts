import { Client, ContactId, MessageTypes } from "@open-wa/wa-automate";
import { addSubmission, updatePoll } from "./db/poll";
import { awaitResponse } from "./flow";

export interface Edge {
    question: string,
    to: string,
    category?: string
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
    submissions: { [username: string]: Submission },
    isActive: boolean
}

export type PollDataDB = PollData  & { _id: any };

export interface Submission {
    path: string[],
    categories: {[key: string]: string}
}

export async function startPoll(pollData: PollDataDB, client: Client) {
    pollData.isActive = true;
    updatePoll(pollData);
    const poll = pollData.poll;
    for (let recepient of pollData.recepients) {
        let current = poll.start;
        let path = [current];
        let categories: {[key: string]: string} = {};
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
            if (selected.category){
                categories[selected.category] = selected.question;
            }
            current = selected.to;
            path.push(current);
            if (!poll.edges[current] || poll.edges[current].length === 0) {
                await client.sendText(recepient, current);
                let submission: Submission = {path, categories};
                addSubmission(submission, pollData, recepient);
                break;
            }
        }

    }
    //return path;
}
