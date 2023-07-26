import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const usermodel = mongoose.model("User", UsersSchema);
