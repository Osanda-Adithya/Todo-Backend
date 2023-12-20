import express from "express";
import * as Task from "../controllers/task";
import { verifyedUser } from "../middleware/verfied_user";

const taskRoute = express.Router();

taskRoute.post("/creattask", verifyedUser, Task.createTask);

taskRoute.post("/updatetask", verifyedUser, Task.updateMainTask);

taskRoute.post("/updatestatus", verifyedUser, Task.updateStatus);

taskRoute.post("/assignids", verifyedUser, Task.assignUsers);

taskRoute.post("/removeassignids", verifyedUser, Task.removeAssignUser);

taskRoute.get("/gettasks", verifyedUser, Task.getAllTask);

taskRoute.get("/removetask/:taskid", verifyedUser, Task.removeTask);

taskRoute.post("/gettasksdaywise", verifyedUser, Task.getTaskDateWise);

taskRoute.get("/gettaskcount", verifyedUser, Task.getTaskCount);

export default taskRoute;
