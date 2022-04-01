const mongoose = require("mongoose");
let database: any;
import { ContactId } from "@open-wa/wa-automate";
import { Schema, Document, Model, model, ObjectId } from "mongoose";
import { Poll, PollData, PollDataDB, Submission } from "../poll";


const pollSchema = new Schema<PollData>({}, { strict: false });

const PollModel = model<PollData>("poll", pollSchema);

export const addPoll = (poll: PollData) => {
    const doc = new PollModel(poll);
    doc.save();
}

export async function findByNameAndUsername(name: string, username: string):
    Promise<(PollData & { _id: any }) | null> {
    return await PollModel.findOne({ name, username }).exec();
}


export const addSubmission = async (submission: Submission, poll: PollDataDB, user: string) => {
    const doc: any = await PollModel.findById(poll._id);
    doc.submissions[user] = submission;
    doc.save();
}

export const getPolls = async (username: string) => {
    return await PollModel.find({ username });
}