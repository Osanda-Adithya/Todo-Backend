import mongoose from "mongoose";
import app from "./app";
import env from "./utils/validateEnv";

const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING).then(() => {
  console.log("MONGO DB CONNECTED");
  app.listen(port, () => {
    console.log("SERVER CONNECTED " + port);
  });
});
