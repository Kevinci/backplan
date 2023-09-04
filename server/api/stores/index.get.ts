import { connect, disconnect } from "mongoose";
import { stores } from "../../dbModels";

export default defineEventHandler(async (event) => {
    if (event.node.req.method === 'GET') {
        const config = useRuntimeConfig()
        try {
            // Connect to the MongoDB database
            await connect(config.mongoUri);

            // Retrieve all stores from the database
            const storeData = await stores.find();

            // Disconnect from the MongoDB database
            await disconnect();

            // Return a JSON response with the retrieved stores as the response body
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: storeData,
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
                data: {
                    message: message,
                },
            };
        }
    } else {
        // Return a 405 Method Not Allowed response for all other HTTP methods
        return {
            status: 405,
            headers: {
                Allow: 'GET',
            },
            body: {
                message: 'Method Not Allowed',
            },
        };
    }
});