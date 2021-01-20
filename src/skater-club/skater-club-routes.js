const express = require("express");
const skaterClubRouter = express.Router();
const skaterClubServices = require("./skater-club-services");

skaterClubRouter
  .route("/")
  .post(async (req, res, next) => {
    try {
      const { skater_id, club_id } = req.body;
      if (!skater_id || !club_id)
        return res
          .status(400)
          .json({ error: { message: "skater_id and club_id required" } });
      const entryResponse = await skaterClubServices.addEntry(
        req.app.get("db"),
        skater_id,
        club_id
      );
      res.status(201).json(entryResponse);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { skater_id, club_id } = req.body;
      await skaterClubServices.deleteEntry(
        req.app.get("db"),
        skater_id,
        club_id
      );
      res.status(200).send(`skater_club entry removed`);
    } catch (error) {
      next(error);
    }
  });

module.exports = skaterClubRouter;
