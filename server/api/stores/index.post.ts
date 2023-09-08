import { connect, disconnect } from 'mongoose';
import { stores } from "../../dbModels";
import { Store } from "~/types/store";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    try {
        const { name, location, description } = await readBody<Store>(event);

        // Connect to the MongoDB database
        await connect(config.mongoUri);

        // Create a new Store document using the User model
        const newStore = new stores({
            name,
            location,
            description,
        });

        // Save the new Store document to the database
        const savedStore = await newStore.save();

        // Disconnect from the MongoDB database
        await disconnect();

        // Return a JSON response with the saved Store document as the response body
        return {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
            data: savedStore,
        };
    } catch (error) {
        let message: string;

        if (typeof error === 'string') {
            message = error;
        } else {
            message = 'An error occurred';
        }

        // Disconnect from the MongoDB database
        await disconnect();

        // Return a JSON response with the error message as the response body
        return {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                message: message,
            },
        };
    }
});
