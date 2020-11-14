require('dotenv').config();
const knex = require('knex');
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});

( async () => {
 const response = await db.select('id').from('skaters');
 const groupListEntries = response.map(entry=>{
   return {
     skater_id: entry.id,
     group_id: Math.ceil(Math.random()*7)
  }
 })
  console.log(groupListEntries)
  await db.insert(groupListEntries).into('canskate_group_list')
  process.exit();
})();