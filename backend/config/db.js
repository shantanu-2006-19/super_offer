import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://chavreshantanu011_db_user:Pt3VnVHiH4MlbrFU@cluster0.lrbim8x.mongodb.net/?appName=Cluster0");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

