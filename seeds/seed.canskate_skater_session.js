require('dotenv').config();
const knex = require('knex');
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});

( async () => {
 const [skaterIds, sessionIds] = await Promise.all([db.select('id').from('skaters'),db.select('id').from('canskate_sessions')]);
 const sessionListEntries = skaterIds.map(entry=>{
   return {
     skater_id: entry.id,
     session_id: sessionIds[Math.floor(Math.random()*sessionIds.length)].id
  }
 })
  console.log(sessionListEntries)
  await db.insert(sessionListEntries).into('canskate_skater_session')
  process.exit();
})();