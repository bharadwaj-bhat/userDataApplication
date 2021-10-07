const express = require("express");
const mongoose = require("mongoose");
const connect = require("./config/config");

const User = require("./model/user.mode");

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  return res.status(201).json(user);
});

app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id).lean().exec();

  return res.status(200).json(user);
});

app.get("/users", async (req, res) => {
  const query = {};
  let page = 1;

  let sort =
    req.query.sort === "asc"
      ? { age: 1 }
      : req.query.sort === "dsc"
      ? { age: -1 }
      : null;

  if (req.query.Page) {
    page = req.query.Page;
  }

  if (req.query.gender) {
    query.gender = req.query.gender;
  }
  if (req.query.age) {
    query.age =
      req.query.age === "ab20"
        ? { $gt: 20 }
        : req.query.age === "ab0"
        ? { $gt: 0 }
        : { $lt: 20 };
  }

  const user = await User.find({ ...query })
    .skip((page - 1) * 10)
    .limit(10)
    .sort(sort)
    .lean()
    .exec();

  const count = await User.find({ ...query }).count();
  return res.status(200).json({ user: user, count: count });
});

app.listen(1234, async () => {
  await connect();
  console.log("listening on 1234");
});
