const express = require('express')
const skaterSessionRouter = express.Router();
const skaterSessionServices = require('./skater-session-services')

skaterSessionRouter.route('/')
.post(async(req,res,next)=>{
  try {
    const {skater_id, session_id} = req.body;
    if (!skater_id || !session_id) return res.status(400).json({error:{message:`skater_id and session_id required`}})
    const entryResponse = await skaterSessionServices.addEntry(req.app.get('db'),skater_id,session_id);
    res.status(201).json(entryResponse);
  } catch (error) {
    next(error)
  }
})
.delete(async(req,res,next)=>{
  try {
    const {skater_id, session_id} = req.body;
    if (!skater_id || !session_id) return res.status(400).send('skater_id and session_id required');
    await skaterSessionServices.deleteEntryBySkaterIdClubId(req.app.get('db'),skater_id,session_id)
    res.status(200).send(`skater_id ${skater_id} session_id ${session_id} session removed`)
  } catch (error) {
    next(error)
  }
})



module.exports = skaterSessionRouter