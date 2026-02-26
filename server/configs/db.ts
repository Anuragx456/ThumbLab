import dns from 'dns';
import mongoose from 'mongoose';

// Force Google DNS to bypass local DNS proxy issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('MongoDB connected'))
        await mongoose.connect(process.env.MONGODB_URI as string)
    } catch (error) {
        console.error('Error connecting to MongoDB:' , error)
    }
}

export default connectDB;