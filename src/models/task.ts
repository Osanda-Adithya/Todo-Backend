import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const Task = new Schema({
  task: { type: String },
  status: { type: Boolean, default: false },
});

const taskSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  dateTime: { type: String },
  description: { type: String },
  status: { type: String, default: "InProgress" },
  plan: { type: [Task] },
  assignTo: { type: [mongoose.Schema.Types.ObjectId] },
});

type Task = InferSchemaType<typeof taskSchema>;

export default model<Task>("tasks", taskSchema);
