const clubServices = require("./club-services");
const express = require('express')
const ClubRouter = express.Router();

ClubRouter.route('/')
.get(async (req,res,next)=>{
  try {
    const clubs = await clubServices.getClubs(req.app.get('db'))
    res.json(clubs)
  } catch (error) {
    next(error)
  }
})


module.exports = ClubRouter

