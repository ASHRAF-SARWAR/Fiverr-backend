import mongoosse from "mongoose";

export async function connectDB() {
  console.log("ENV", process.env.MONGO_URL);
  try {
    await mongoosse
      .connect(
        "mongodb+srv://ashrafsarwar546:123@cluster0.jjmkbcu.mongodb.net/fiverr"
      )
      .then(() => console.log("MongoDB connected"));
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
}
