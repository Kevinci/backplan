import { Store } from "~/types/store";
import { stores } from "../../dbModels";
import { connect, disconnect } from 'mongoose';

export default defineEventHandler(async (event) => {
    console.log(event);
    const storeId = event.context?.params?.id;
    const updatedData = await readBody<Store>(event); // new data to be updated
    const config = useRuntimeConfig()
    try {
        if (!storeId) {
            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    code: 'MISSING_STORE_ID',
                    message: 'Store ID is missing from the request.',
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
        await connect(config.mongoUri);

        // Update the store with the specified ID in the database
        const storeData = await stores.findOneAndUpdate({ _id: storeId }, updatedData, { new: true });

        // Disconnect from the MongoDB database
        await disconnect();

        if (storeData) {
            // If the store was updated successfully, return a JSON response with the updated store data
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: storeData,
            };
        } else {
            // If the store was not found, return a 404 Not Found response
            return {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    code: 'STORE_NOT_FOUND',
                    message: `Store with id ${storeId} doesn't exist.`,
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
