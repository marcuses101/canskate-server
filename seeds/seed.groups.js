require('dotenv').config();
const {makeGroupArray} = require('../test/group.fixtures')
const knex = require('knex');
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});

const groups = makeGroupArray();
console.log(groups);


(async()=>{
  await db.insert(groups).into('groups')
  process.exit();
})().catch(e=>{
  console.log(e)
  process.exit();
})