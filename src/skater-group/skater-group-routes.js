const express = require('express');
const skaterGroupServices = require('./skater-group-services');
const skaterGroupRouter = express.Router();


skaterGroupRouter.route('/')
.post(async(req,res,next)=>{
  try {
    const {skater_id,group_id} = req.body
    if (!skater_id || !group_id) return res.status(400).json({error:{message:'skater_id and group_id required'}});
    const entryResponse = await skaterGroupServices.addEntry(req.app.get('db'),skater_id,group_id);
    res.status(201).json(entryResponse);
  } catch (error) {
    next(error)
  }
})
.patch(async(req,res,next)=>{
  try {
    const {skater_id,group_id,new_group_id} = req.body
    if (!skater_id || !group_id || !new_group_id) return res.status(400).json({error:{message:'skater_id, group_id, and new_group_id required'}})
    const updatedEntry = await skaterGroupServices.updateEntry(req.app.get('db'),skater_id, group_id, new_group_id);
    res.status(200).json(updatedEntry)
  } catch (error) {
    next(error)
  }
})


module.exports = skaterGroupRouter