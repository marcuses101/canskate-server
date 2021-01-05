const express = require("express");
const groupServices = require("./group-services");
const GroupRouter = express.Router();

GroupRouter.route("/")
  .get(async (req, res, next) => {
    try {
      const responseGroups = await groupServices.getAllGroups(
        req.app.get("db")
      );
      res.json(responseGroups);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { group_color, session_id } = req.body;
      const groupColors = [
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Blue",
        "Purple",
        "Turquoise",
      ];
      const requestGroup = { group_color, session_id };
      for (const [key, value] of Object.entries(requestGroup)) {
        if (!value)
          return res
            .status(400)
            .json({ error: { message: `${key} is required` } });
      }
      if (!groupColors.includes(group_color))
        return res.status(400).json({
          error: {
            message: `Invalid 'group_color' please choose the following list: ${groupColors.join(
              ", "
            )}`,
          },
        });
      const responseGroup = await groupServices.insertGroup(
        req.app.get("db"),
        requestGroup
      );
      res.status(201).json(responseGroup);
    } catch (error) {
      next(error);
    }
  });

GroupRouter.route("/:id")
  .all(async (req, res, next) => {
    try {
      const { id } = req.params;
      const group = await groupServices.getGroupById(req.app.get("db"), id);
      if (!group) {
        return res
          .status(400)
          .json({ error: { message: `Group with id ${id} does not exist` } });
      }
      req.group = group;
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req, res) => {
    res.json(req.group);
  })
  .patch(async (req, res, next) => {
    try {
      const groupColors = [
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Blue",
        "Purple",
        "Turquoise",
      ];
      const { group_color } = req.body;
      if (!group_color)
        return res.status(400).send(`'group_color' is required`);
      if (!groupColors.includes(group_color))
        return res
          .status(400)
          .send(
            `'group_color must be one of the following list: ${groupColors.join(
              ", "
            )}`
          );
      await groupServices.updateGroup(req.app.get("db"), req.group.id, {
        group_color,
      });
      res.status(200).send(`Group with id ${req.group.id} updated`)
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await groupServices.deleteGroup(req.app.get('db'),req.group.id);
      res.send(`Group with id ${req.group.id} deleted`)
    } catch (error) {
      next(error)
    }
  });

module.exports = GroupRouter;
