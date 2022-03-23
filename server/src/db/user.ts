const mongoose = require("mongoose");
let database: any;
import { Schema, Document, Model, model } from "mongoose";

export interface User {
    username: string,
    password: string
}

const userSchema = new Schema<User>({
    username: String,
    password: String
});

const UserModel = model<User>("model", userSchema);

export const add = (user: User) => {
    const doc = new UserModel(user);
    doc.save();
}

export const exists = (user: User): boolean => {
    let a = UserModel.exists(user);
    return true;
}

export const connectToDb = async () => {
    // add your own uri below
    const uri = "mongodb://localhost:27017/test";
    if (database) {
        return;
    }
    await mongoose.connect(uri);
    database = mongoose.connection;
};
export const disconnect = () => {
    if (!database) {
        return;
    }
    mongoose.disconnect();
};