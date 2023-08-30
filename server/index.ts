import { Nitro } from 'nitropack'
import mongoose from 'mongoose'

export default async (_nitroApp: Nitro) => {
    const config = useRuntimeConfig()
    try {
        await mongoose.connect(config.mongoUri)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('error', error);
    }
}