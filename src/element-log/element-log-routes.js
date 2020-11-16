const express = require("express");
const ElementLogServices = require("./element-log-services");
const CheckmarkLogServices = require("./checkmark-log-services");
const RibbonLogServices = require("./ribbon-log-services");
const BadgeLogServices = require("./badge-log-services");
const CheckmarkServices = require("../element/checkmark-services");
const RibbonServices = require("../element/ribbon-services");
const ElementLogRouter = express.Router();

module.exports = ElementLogRouter;

ElementLogRouter.route("/")
  .get(async (req, res, next) => {
    try {
      const logs = await ElementLogServices.getLogs(req.app.get("db"));
      res.json(logs);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const db = req.app.get("db");
      const { skater_id, element_id, date_completed } = req.body;
      const checkmark_id = element_id.slice(0, 3);
      const ribbon_id = element_id.slice(0, 2);
      const badge_id = element_id.slice(0, 1);
      const requestElementLog = { skater_id, element_id };
      for (const [key, value] of Object.entries(requestElementLog)) {
        if (!value)
          return res.status(400).json({
            error: { message: `${key} is required` },
          });
      }
      requestElementLog.date_completed = date_completed;
      const responseElementLog = await ElementLogServices.insertLog(
        db,
        requestElementLog
      );
      const responseObject = {
        element_log: responseElementLog,
        checkmark_log: null,
        ribbon_log: null,
        badge_log: null,
      };
      // check if new checkmark log is required
      const [{ total_elements }, completedElements] = await Promise.all([
        CheckmarkServices.getCheckmarkById(db, checkmark_id),
        ElementLogServices.countCompletedElementsByCheckmark(
          db,
          skater_id,
          checkmark_id
        ),
      ]);
      // send response if no further logs are required
      if (total_elements != completedElements) return res.json(responseObject);
      responseObject.checkmark_log = await CheckmarkLogServices.insertLog(db, {
        checkmark_id,
        date_completed,
        skater_id,
      });
      // check if new ribbon log is required
      const [{ checkmarks_required }, completedCheckmarks] = await Promise.all([
        RibbonServices.getRibbonById(db, ribbon_id),
        CheckmarkLogServices.countCompletedCheckmarksByRibbon(
          db,
          skater_id,
          ribbon_id
        ),
      ]);
      //send response if no further logs are required
      if (checkmarks_required !== completedCheckmarks)
        return res.json(responseObject);
      responseObject.ribbon_log = await RibbonLogServices.insertLog(db, {
        skater_id,
        date_completed,
        ribbon_id,
      });
      // check if new badge log is required
      const completedRibbons = await RibbonLogServices.countCompletedRibbonsByBadge(
        db,
        skater_id,
        badge_id
      );
      //send response if no further logs are required
      if (completedRibbons !== 3) return res.json(responseObject);

      responseObject.badge_log = await BadgeLogServices.insertLog(db,{
        skater_id,
        badge_id,
        date_completed
      })
      res.json(responseObject)
    } catch (error) {
      next(error);
    }
  });

ElementLogRouter.route("/:id")
  .all(async (req, res, next) => {
    try {
      const { id } = req.params;
      const log = await ElementLogServices.getLogById(req.app.get("db"), id);
      if (!log)
        return res
          .status(400)
          .json({ error: { message: `No log with id '${id}'` } });
      req.log = log;
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req, res) => {
    return res.json(req.log);
  })
  .patch(async (req, res, next) => {
    try {
      const { date_completed } = req.body;
      if (!date_completed)
        return res.status(400).send(`date_completed required`);
      await ElementLogServices.updateLog(req.app.get("db"), req.log.id, {
        date_completed,
      });
      return res.status(200).send(`log with id '${req.log.id} updated'`);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await ElementLogServices.deleteLog(req.app.get("db"), req.log.id);
      res.status(204).send(`Log with id: ${req.log.id} deleted.`);
    } catch (error) {
      next(error);
    }
  });
