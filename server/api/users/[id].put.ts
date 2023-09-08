import { User } from "~/types/user";
import { users } from "../../dbModels";
import { connect, disconnect } from 'mongoose';

export default defineEventHandler(async (event) => {
    console.log(event);
    const userId = event.context?.params?.id;
    const updatedData = await readBody<User>(event); // new data to be updated
    try {
        if (!userId) {
            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    code: 'MISSING_USER_ID',
                    message: 'User ID is missing from the request.',
                },
            };
        }
        if (!updatedData) {
            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    code: 'MISSING_UPDATED_DATA',
                    message: 'Updated data is missing from the request body.',
                },
            };
        }

        // Connect to the MongoDB database
        await connect('mongodb://localhost:27017/mydatabase');

        // Update the user with the specified ID in the database
        const userData = await users.findOneAndUpdate({ _id: userId }, updatedData, { new: true });

        // Disconnect from the MongoDB database
        await disconnect();

        if (userData) {
            // If the user was updated successfully, return a JSON response with the updated user data
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
