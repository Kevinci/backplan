import { connect, disconnect } from "mongoose";
import { users } from "../../dbModels";

export default defineEventHandler(async (event) => {
    if (event.node.req.method === 'GET') {
        const config = useRuntimeConfig()
        try {
            // Connect to the MongoDB database
            await connect(config.mongoUri);

            // Retrieve all users from the database
            const usersData = await users.find();

            // Disconnect from the MongoDB database
            await disconnect();

            // Return a JSON response with the retrieved users as the response body
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: usersData,
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