import { InferSchemaType, Schema, model } from "mongoose";

const planSchema = new Schema({
  task: { type: String },
  status: { type: String },
});

const goalSchema = new Schema({
  title: { type: String },
  dateTime: { type: String },
  description: { type: String },
  plan: { type: [planSchema] },
});

type Goals = InferSchemaType<typeof goalSchema>;

export default model<Goals>("goals", goalSchema);
