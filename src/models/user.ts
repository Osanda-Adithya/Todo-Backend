import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String, select: false },
  profileImage: { type: String },
});

// userSchema.index({ username: "text" });

type User = InferSchemaType<typeof userSchema>;

export default model<User>("Users", userSchema);
