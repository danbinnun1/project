import { Client, ContactId, MessageTypes } from "@open-wa/wa-automate";
import { addSubmission, PollModel, updatePoll } from "./db/poll";
import { awaitResponse } from "./flow";

export interface Edge {
    question: string,
    to: number,
    category?: string
}

export interface Poll {
    start: number,
    vertexes: { [id: number]: string },
    edges: { [from: number]: Edge[] }
}

export interface PollData {
    poll: Poll,
    username: string,
    name: string,
    recepients: ContactId[],
    submissions: { [username: string]: Submission },
    status: 'READY' | 'ACTIVE' | 'FINISHED',
    startTimeStamp: number
}

export type PollDataDB = PollData & { _id: any };

export interface Submission {
    path: number[],
    categories: { [key: string]: string }
}

export async function startPoll(pollData: PollDataDB, client: Client) {
    await PollModel.findByIdAndUpdate(pollData._id, { status: 'ACTIVE', startTimeStamp: Date.now() },
        function (err: any, docs: any) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
            }
        });
    const poll = pollData.poll;
    for (let recepient of pollData.recepients) {
        let current = poll.start;
        let path = [current];
        let categories: { [key: string]: string } = {};
        while (true) {
            const response = await awaitResponse(client,
                recepient,
                recepient,
                undefined,
                "choose an option",
                MessageTypes.BUTTONS_RESPONSE,
                undefined, undefined,
                poll.edges[current].map(edge => edge.question),
                poll.vertexes[current]);
            let selected: any = poll.edges[current].filter(edge => edge.question === response.text)[0];
            if (selected.category) {
                categories[selected.category] = selected.question;
            }
            current = selected.to.id;
            path.push(current);
            if (!poll.edges[current] || poll.edges[current].length === 0) {
                await client.sendText(recepient, poll.vertexes[current]);
                let submission: Submission = { path, categories };
                addSubmission(submission, pollData, recepient);
                break;
            }
        }

    }
    //return path;
}
