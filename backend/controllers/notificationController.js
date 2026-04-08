import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: { $in: [req.user._id, null] } }).sort({ createdAt: -1 });
  res.json(notifications);
};

export const markRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: "Marked as read" });
};
