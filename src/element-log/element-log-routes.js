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
        checkmark_log: {},
        ribbon_log: {},
        badge_log: {},
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

      responseObject.badge_log = await BadgeLogServices.insertLog(db, {
        skater_id,
        badge_id,
        date_completed,
      });
      res.json(responseObject);
    } catch (error) {
      next(error);
    }
  })

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
  .delete(async (req, res, next) => {
    try {
      const db = req.app.get("db");
      await ElementLogServices.deleteLog(db, req.log.id);
      const { skater_id, element_id } = req.log;
      const checkmark_id = element_id.slice(0, 3);
      const ribbon_id = element_id.slice(0, 2);
      const badge_id = element_id.slice(0, 1);
      const responseObj = {
        deletedLogs: {
          element_log_id: req.log.id,
          checkmark_log_id: null,
          ribbon_log_id: null,
          badge_log_id: null,
        },
      };
      const {
        id: deletedCheckmarkLogId,
      } = await CheckmarkLogServices.deleteLogBySkaterCheckmark(
        db,
        skater_id,
        checkmark_id
      );

      responseObj.deletedLogs.checkmark_log_id = deletedCheckmarkLogId;

      const { checkmarks_required } = await RibbonServices.getRibbonById(
        db,
        ribbon_id
      );

      const completedCheckmarks = await CheckmarkLogServices.countCompletedCheckmarksByRibbon(
        db,
        skater_id,
        ribbon_id
      );

      if (!completedCheckmarks == checkmarks_required - 1) {
        return res.json(responseObj);
      }

      const {
        id: deletedRibbonLogId,
      } = await RibbonLogServices.deleteLogBySkaterRibbon(
        db,
        skater_id,
        ribbon_id
      );

      responseObj.deletedLogs.ribbon_log_id = deletedRibbonLogId;

      const completedRibbons = await RibbonLogServices.countCompletedRibbonsByBadge(
        db,
        skater_id,
        badge_id
      );
      if (completedRibbons != 2) return res.json(responseObj);

      const {
        id: deletedBadgeLogId,
      } = await BadgeLogServices.deleteLogBySkaterBadge(
        db,
        skater_id,
        badge_id
      );
      responseObj.deletedLogs.badge_log_id = deletedBadgeLogId;
      res.json(responseObj);
    } catch (error) {
      next(error);
    }
  });
