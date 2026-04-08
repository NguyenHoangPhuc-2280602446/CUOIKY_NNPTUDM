import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already registered" });
  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id, user.role);
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = signToken(user._id, user.role);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
