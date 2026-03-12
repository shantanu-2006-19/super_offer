import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URL);
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error.message);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

