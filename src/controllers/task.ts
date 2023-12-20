import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Task from "../models/task";
import { ObjectId } from "mongodb";

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const title = req.body.title;
    const dateTime = req.body.dateTime;
    const description = req.body.description;
    const tasks = req.body.tasks;
    const assignTo = req.body.assignTo;

    if (!title || !dateTime || !description || !tasks) {
      throw createHttpError(404, "Missing parameter");
    }

    const task = await Task.create({
      userID: req.user._id,
      title,
      dateTime,
      description,
      plan: tasks,
      assignTo,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateMainTask: RequestHandler = async (req, res, next) => {
  try {
    const taskID = req.body.taskid;
    const title = req.body.title;
    const dateTime = req.body.dateTime;
    const description = req.body.description;
    const tasks = req.body.tasks;
    const assignTo = req.body.assignTo;

    if (!title || !dateTime || !description || !tasks || !taskID) {
      throw createHttpError(404, "Missing parameter");
    }

    await Task.findByIdAndUpdate(taskID, {
      title,
      dateTime,
      description,
      plan: tasks,
      assignTo,
    }).exec();

    const task = await Task.findById(taskID);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateStatus: RequestHandler = async (req, res, next) => {
  try {
    const taskID = req.body.taskid;
    const subTaskID = req.body.subTaskid;

    if (!taskID || !subTaskID) {
      throw createHttpError(404, "Missing parameter");
    }

    await Task.updateOne(
      {
        _id: taskID,
        userID: req.user._id,
      },
      {
        $set: {
          "plan.$[plan].status": true,
        },
      },
      {
        arrayFilters: [{ "plan._id": { $eq: subTaskID } }],
      }
    );

    const task = await Task.findById(taskID);
    if (!task?.plan.some((i) => i.status === false)) {
      await Task.updateOne({ _id: taskID }, { $set: { status: "Complete" } });
    }
    res.status(201).json({ data: { status: "Update Complete" } });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const assignUsers: RequestHandler = async (req, res, next) => {
  try {
    const taskID = req.body.taskid;
    const assignIds = req.body.assignIds;
    await Task.updateOne(
      { _id: taskID, userID: req.user._id },
      { $push: { assignTo: assignIds.map((e: string) => e) } }
    );

    res.status(201).json({ data: { status: "Update Complete" } });
  } catch (error) {
    next(error);
  }
};

export const removeAssignUser: RequestHandler = async (req, res, next) => {
  try {
    const taskID = req.body.taskid;
    const assignIds = req.body.assignIds;

    await Task.updateOne(
      { _id: taskID, userID: req.user._id },
      { $pull: { assignTo: { $in: [assignIds.map((e: string) => e)] } } }
    );

    res.status(201).json({ data: { status: "Removed Complete" } });
  } catch (error) {
    next(error);
  }
};

export const getAllTask: RequestHandler = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const tasks = await Task.find({ userID: new ObjectId(userID) });

    res.status(201).json({ data: tasks });
  } catch (error) {
    next(error);
  }
};

export const removeTask: RequestHandler = async (req, res, next) => {
  try {
    const taskID = req.params.taskid;

    await Task.deleteOne({ _id: taskID });

    res
      .status(201)
      .json({ data: { status: `${taskID} removed successfully` } });
  } catch (error) {
    next(error);
  }
};

export const getTaskDateWise: RequestHandler = async (req, res, next) => {
  try {
    const date = req.body.date;
    const userID = req.user._id;

    const task = await Task.aggregate([
      {
        $match: {
          userID: new ObjectId(userID),
          dateTime: new Date(date).toISOString(),
        },
      },
      {
        $project: {
          title: 1,
          dateTime: 1,
          description: 1,
          plan: 1,
          assignTo: 1,
        },
      },
    ]);

    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
};

export const getTaskCount: RequestHandler = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const allTask = await Task.find({ userID });
    const complete = await Task.find({ userID, status: "Complete" });
    res
      .status(201)
      .json({
        data: { allTask: allTask.length, comleteTask: complete.length },
      });
  } catch (error) {
    next(error);
  }
};
