const express = require("express");
const path = require("path");
const xss = require("xss");
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
      res.json(skaters.map(serializeSkater));
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
  .get((req,res)=>res.json(req.skater))
  .patch(async (req, res, next) => {
    try {
      const { fullname, gender, birthdate } = req.body;
      const updatedSkater = { fullname, gender, birthdate };
      if (!Object.values(updatedSkater).some(Boolean)) {
        return res
          .status(400)
          .send(`'fullname', 'gender', and/or 'birthdate' required`);
      }
      await skaterServices.updateSkater(
        req.app.get("db"),
        req.skater.id,
        updatedSkater
      );
      res.status(204).send(`Skater id: ${req.skater.id} updated`);
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
