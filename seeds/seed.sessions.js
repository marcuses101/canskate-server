require('dotenv').config();
const {makeSessionsArray} = require('../test/session.fixtures')
const knex = require('knex');
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});

const clubs = makeSessionsArray();


(async()=>{
  await db.insert(clubs).into('sessions')
  process.exit();
})().catch(e=>{
  console.log(e)
  process.exit();
})