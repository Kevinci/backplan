import mongoose, { Schema } from "mongoose";
import bcrypt from "mongoose-bcrypt";

const schema = new Schema({

    password: {
        type: String,
        required: false,
        bcrypt: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    worktime: {
        type: String,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true, strict: true, strictQuery: true }
)

schema.plugin(bcrypt);
export default mongoose.model("User", schema, "users");