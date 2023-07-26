import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { usermodel } from "../models/Users.js";
import { sign } from "crypto";

const routes = express.Router();

routes.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await usermodel.findOne({ username });

  if (user) {
    return res.json({ message: "User already exist" });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  const newuser = new usermodel({ username, password: hashedpassword });
  await newuser.save();
  res.json({ message: "User created successfully" });
});

routes.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await usermodel
      .findOne({ username: username }) //, password: password
      .exec();

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    const checkpassword = await bcrypt.compare(password, user.password);

    if (checkpassword) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.json({ token, UserId: user._id });

      return;
    } else {
      res.send("Invalid password");
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Internal Server Error");
  }
});

export { routes as register };
