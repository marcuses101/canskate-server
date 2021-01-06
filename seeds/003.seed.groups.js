require('dotenv').config();
const {makeGroupArray} = require('../test/fixtures/group.fixtures')
// const knex = require('knex');
// const db = knex({
//   client: "pg",
//   connection: process.env.DATABASE_URL
// });

const groups = makeGroupArray().map(({group_color,session_id})=>({group_color,session_id}));

async function seedGroups (db){
  await db.insert(groups).into('groups')
}
// (async()=>{
//   await db.insert(groups).into('groups')
//   process.exit();
// })().catch(e=>{
//   console.log(e)
//   process.exit();
// })

module.exports = {seedGroups};