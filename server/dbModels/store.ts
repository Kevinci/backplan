import mongoose, { Schema } from "mongoose";

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

const StoreSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    events: [EventSchema]
},
    { timestamps: true, strict: true, strictQuery: true }
)

export default mongoose.model("Store", StoreSchema, "stores");