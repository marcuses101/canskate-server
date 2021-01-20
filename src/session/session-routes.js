const express = require("express");
const path = require("path");
const SessionServices = require("./session-services");
const SessionRouter = express.Router();

SessionRouter.route("/")
  .post(async (req, res, next) => {
    try {
      const { day, start_time, duration, club_id } = req.body;
      const requestSession = { day, start_time, duration, club_id };
      for (const [key, value] of Object.entries(requestSession)) {
        if (!value)
          return res
            .status(400)
            .json({ error: { message: `Error: ${key} is required` } });
      }
      const responseSession = await SessionServices.insertSession(
        req.app.get("db"),
        requestSession
      );
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${responseSession.id}`))
        .json(responseSession);
    } catch (error) {
      next(error);
    }
  });

SessionRouter.route("/:id")
  .all(async (req, res, next) => {
    try {
      const { id } = req.params;
      const session = await SessionServices.getSessionById(
        req.app.get("db"),
        id
      );
      if (!session) {
        return res
          .status(404)
          .json({ error: { message: `Session with id ${id} not found` } });
      }
      req.session = session;
      next();
    } catch (error) {
      next(error);
    }})
  .get((req, res) => {
    res.json(req.session);
  })
  .patch(async (req, res, next) => {
    try {
      const { day, start_time, duration } = req.body;
      const requestSession = { day, start_time, duration };
      if (!Object.values(requestSession).some(Boolean)) {
        return res
          .status(400)
          .json({error:{message:"day, start_time, and/or duration is required"}});
      }
     const responseSession =  await SessionServices.updateSession(
        req.app.get("db"),
        req.session.id,
        requestSession
      );
      res.status(200).json(responseSession)
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await SessionServices.deleteSkater(req.app.get("db"), req.session.id);
      res.send(`Session id: ${req.session.id} deleted`);
    } catch (error) {
      next(error);
    }
  });

module.exports = SessionRouter;
