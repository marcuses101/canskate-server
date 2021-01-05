const clubServices = require("./club-services");
const sessionServices = require("../session/session-services");
const express = require("express");
const xss = require("xss");
const groupServices = require("../group/group-services");
const skaterServices = require("../skater/skater-services");
const skaterSessionServices = require("../skater-session/skater-session-services");
const skaterGroupServices = require("../skater-group/skater-group-services");
const ElementLogServices = require("../element-log/element-log-services");
const CheckmarkLogServices = require("../element-log/checkmark-log-services");
const RibbonLogServices = require("../element-log/ribbon-log-services");
const BadgeLogServices = require("../element-log/badge-log-services");
const ClubRouter = express.Router();

function serializeClub(club) {
  return { ...club, name: xss(club.name) };
}

ClubRouter.route("/")
.get(async (req, res, next) => {
  try {
    const clubs = await clubServices.getClubs(req.app.get("db"));
    res.json(clubs);
  } catch (error) {
    next(error);
  }
})
.post(async(req,res,next)=>{
  try {
    const {name} = req.body;
    if (!name) return res.status(400).json({error:{message:'name is required'}});
    const responseClub = await clubServices.addClub(req.app.get('db'),{name})
    res.status(201).json(responseClub)
  } catch (error) {
    next(error)
  }
})

ClubRouter.route("/:id")
  .all(async (req, res, next) => {
    try {
      const { id } = req.params;
      const club = await clubServices.getClubById(req.app.get("db"), id);
      if (!club)
        return res.status(404).json({
          error: { message: `club with id ${id} not found` },
        });
      req.club = serializeClub(club);
      next();
    } catch (error) {
      next(error);
    }
  })
  // this route is used to load all club data for use in the react application.
  .get(async (req, res, next) => {
    try {
      const { id: club_id } = req.params;
      const [
        {name, id},
        sessions,
        groups,
        skaterSessionEntries,
        skaterGroupEntries,
      ] = await Promise.all([
        clubServices.getClubById(req.app.get('db'),club_id),
        sessionServices.getSessionsByClubId(req.app.get("db"), club_id),
        groupServices.getGroupsByClubId(req.app.get("db"), club_id),
        skaterSessionServices.getEntriesByClubId(req.app.get("db"), club_id),
        skaterGroupServices.getEntriesByClubId(req.app.get("db"), club_id),
      ]);
      const skaters =  await skaterServices.getSkatersByClubId(req.app.get("db"), club_id);
      const skatersWithLogs = await Promise.all(skaters.map(async (skater) => {
          const [elementLog, checkmarkLog, ribbonLog, badgeLog] = await Promise.all([
            ElementLogServices.getLogsBySkaterId(req.app.get("db"), skater.id),
            CheckmarkLogServices.getLogsBySkaterId(
              req.app.get("db"),
              skater.id
            ),
            RibbonLogServices.getLogsBySkaterId(req.app.get("db"), skater.id),
            BadgeLogServices.getLogsBySkaterId(req.app.get("db"), skater.id),
          ]);

          return { ...skater, elementLog, checkmarkLog, ribbonLog, badgeLog };
        })
      );
      res.json({
        name,
        id,
        sessions,
        groups,
        skatersWithLogs,
        skaterSessionEntries,
        skaterGroupEntries,
      });
    } catch (error) {
      next(error);
    }
  })
.patch(async(req,res,next)=>{
  try {
    const {name} = req.body;
    if (!name) return res.status(400).json({error:{message:'name is required'}});
    const databaseClub = await clubServices.updateClub(req.app.get('db'),req.club.id,name);
    res.status(200).json(databaseClub)
  } catch (error) {
    next(error)
  }
})
module.exports = ClubRouter;
