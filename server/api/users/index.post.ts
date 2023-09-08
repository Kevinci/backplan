import { connect, disconnect } from 'mongoose';
import { users } from "../../dbModels";
import { User } from "~/types/user";



export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    try {
        const { firstname, lastname, email, description, worktime, isAdmin } = await readBody<User>(event);

        // Connect to the MongoDB database
        await connect(config.mongoUri);

        // Create a new User document using the User model
        const newUser = new users({
            firstname,
            lastname,
            email,
            description,
            worktime,
            isAdmin,
        });

        // Save the new User document to the database
        const savedUser = await newUser.save();

        // Disconnect from the MongoDB database
        await disconnect();

        // Return a JSON response with the saved User document as the response body
        return {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
            data: savedUser,
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
