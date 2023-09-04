import mongoose, { Schema } from "mongoose";

const schema = new Schema({
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
},
    { timestamps: true, strict: true, strictQuery: true }
)

export default mongoose.model("Store", schema, "stores");