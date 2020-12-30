const express = require("express");
const path = require("path");
const xss = require("xss");
const ElementLogServices = require("../element-log/element-log-services");
const CheckmarkLogServices = require('../element-log/checkmark-log-services')
const RibbonLogServices = require('../element-log/ribbon-log-services')
const BadgeLogServices = require('../element-log/badge-log-services')
const skaterServices = require("./skater-services");
const skaterRouter = express.Router();

function serializeSkater(skater) {
  return { ...skater, fullname: xss(skater.fullname) };
}

skaterRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const skaters = await skaterServices.getAllSkaters(req.app.get("db"));
     const skatersWithLogs = await Promise.all(skaters.map(async (skater)=>{
      const elementLog = await ElementLogServices.getLogsBySkaterId(req.app.get('db'),skater.id);
      const checkmarkLog = await CheckmarkLogServices.getLogsBySkaterId(req.app.get('db'),skater.id);
      const ribbonLog = await RibbonLogServices.getLogsBySkaterId(req.app.get('db'),skater.id)
      const badgeLog = await BadgeLogServices.getLogsBySkaterId(req.app.get('db'),skater.id)
      return {...skater, elementLog,checkmarkLog,ribbonLog,badgeLog};
     }))
      res.json(skatersWithLogs.map(serializeSkater));
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { fullname, gender, birthdate } = req.body;
      const newSkater = { fullname, gender };
      for (const [key, value] of Object.entries(newSkater)) {
        if (!value)
          return res.status(400).json({
            error: { message: `Error: ${key} is required` },
          });
      }
      newSkater.birthdate = birthdate;
      const returnedSkater = await skaterServices.insertSkater(
        req.app.get("db"),
        serializeSkater(newSkater)
      );
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${returnedSkater.id}`))
        .json(returnedSkater);
    } catch (error) {
      next(error);
    }
  });

skaterRouter
  .route("/:id")
  .all(async (req, res, next) => {
    try {
      const { id } = req.params;
      const skater = await skaterServices.getSkaterById(req.app.get("db"), id);
      if (!skater)
        return res.status(404).json({
          error: { message: `skater with id ${id} not found` },
        });
      req.skater = serializeSkater(skater);
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req, res) => res.json(req.skater))
  .patch(async (req, res, next) => {
    try {
      const { fullname, gender, birthdate } = req.body;
      const updatedSkater = { fullname, gender, birthdate };
      if (!Object.values(updatedSkater).some(Boolean)) {

        return res
          .status(400)
          .json({
            error: {
              message: `'fullname', 'gender', and/or 'birthdate' required`,
            },
          });
      }
      if (gender && !["Male", "Female", "Other"].includes(gender))
        return res
          .status(400)
          .json({
            error: {
              message: `Please select Male, Female, or Other for gender`,
            },
          });
     const databaseSkater =  await skaterServices.updateSkater(
        req.app.get("db"),
        req.skater.id,
        updatedSkater
      );
      res.status(200).json(databaseSkater);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await skaterServices.deleteSkater(req.app.get("db"), req.skater.id);
      res.status(204).send(`Skater with id: ${req.skater.id} deleted`);
    } catch (error) {
      next(error);
    }
  });

module.exports = skaterRouter;
