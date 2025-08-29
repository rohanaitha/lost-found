import express, { json } from "express";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
dotenv.config();
console.log("Cloudinary check:", process.env.CLOUD_NAME);

app.use(cors());
app.use(json());

const URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
mongoose.connect(URI).then(() => {
  console.log("mongo connection success");
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use("/", UserRoute);

export default app;
