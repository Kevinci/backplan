import { users } from "../../dbModels";
import { connect, disconnect } from 'mongoose';

export default defineEventHandler(async (event) => {
    const userId = event.context?.params?.id;
    const config = useRuntimeConfig()
    try {
        // Connect to the MongoDB database
        await connect(config.mongoUri);

        // Retrieve the user with the specified ID from the database
        const userData = await users.findOne({ _id: userId });

        // Disconnect from the MongoDB database
        await disconnect();

        if (userData) {
            // If the user was found, return a JSON response with the user data
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: userData,
            };
        } else {
            // If the user was not found, return a 404 Not Found response
            return {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    code: 'USER_NOT_FOUND',
                    message: `User with id ${userId} doesn't exist.`,
                },
            };
        }
    } catch (error) {
        // Disconnect from the MongoDB database
        await disconnect();

        // If there was an error, return a 500 Internal Server Error response
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                code: 'ERROR',
                message: 'Something went wrong.',
            },
        };
    }
});
