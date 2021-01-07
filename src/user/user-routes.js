const express = require("express");
const bcrypt = require("bcrypt");
const UserRouter = express.Router();
const userServices = require("./user-services");

UserRouter.route("/")
  .get(async (req, res) => {
    return res.send("hello users");
  })
  .post(async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username)
        return res
          .status(400)
          .json({ error: { message: "username required" } });
      if (!password)
        return res
          .status(400)
          .json({ error: { message: "password required" } });

      const hashedPassword = await bcrypt.hash(password, 10);
      await userServices.addUser(req.app.get("db"), {
        username,
        password: hashedPassword,
      });
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  });

module.exports = UserRouter;
