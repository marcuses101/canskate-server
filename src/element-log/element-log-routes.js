const express = require("express");
const ElementLogServices = require("./element-log-services");
const CheckmarkLogServices = require('./checkmark-log-services');
const RibbonLogServices = require('./ribbon-log-services');
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
      const db = req.app.get('db');
      const { skater_id, element_id, date_completed } = req.body;
      const logEntry = { skater_id, element_id };
      for (const [key, value] of Object.entries(logEntry)) {
        if (!value)
          return res.status(400).json({
            error: { message: `${key} is required` },
          });
      }
      logEntry.date_completed = date_completed;
      const elementLog = await ElementLogServices.insertLog(
        req.app.get("db"),
        logEntry
      );
      elementLog.checkmark_id = elementLog.element_id.slice(0,3);
      elementLog.ribbon_id = elementLog.element_id.slice(0,2);
      const checkmarkLog = await CheckmarkLogServices.verifyElements(db, elementLog);
      const ribbonLog = await RibbonLogServices.verifyCheckmarks(db, elementLog);
      res.status(201).json(elementLog);
    } catch (error) {
      next(error);
    }
  });

ElementLogRouter.route("/:id")
  .all(async (req, res, next) => {
    try {
      const { id } = req.params;
      const log = await ElementLogServices.getLogById(
        req.app.get("db"),
        id
      );
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
