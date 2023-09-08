import mongoose, { Schema } from "mongoose";
import bcrypt from "mongoose-bcrypt";

const EventSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    allDay: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: '#3788d8',
    },
    extendedProps: {
        description: String,
    }
});

const UserSchema = new Schema({
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
    },
    events: [EventSchema]
},
    { timestamps: true, strict: true, strictQuery: true }
)

UserSchema.plugin(bcrypt);
export default mongoose.model("User", UserSchema, "users");