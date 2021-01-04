require('dotenv').config();
const {makeClubsArray} = require('../test/club.fixtures')
const knex = require('knex');
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});

const clubs = makeClubsArray();


(async()=>{
  await db.insert(clubs).into('clubs')
  process.exit();
})().catch(e=>{
  console.log(e)
  process.exit();
})