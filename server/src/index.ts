import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users";
import dotenv from "dotenv";
import { recipeRouter } from "./routes/recipes";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@recipes.roxxca5.mongodb.net/recipes?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI);

app.listen(3001, () => console.log("server started"));
