require('dotenv').config();
const fs = require('fs/promises');
const knex = require('knex')
const SkaterServices = require('./src/skater/skater-services')
const GroupServices = require('./src/group/group-services')
const SessionServices = require('./src/session/session-services')
const SkaterGroupListServices = require('./src/skater-group-list/skater-group-list-services')
const db = knex({
  client:"pg",
  connection: process.env.DATABASE_URL
})

async function getStore(db){

  const [skaters, groups, sessions,skaterGroupEntries] = await Promise.all([
    SkaterServices.getAllSkaters(db),
    GroupServices.getAllGroups(db),
    SessionServices.getAllSessions(db),
    SkaterGroupListServices.getAllEntries(db)
  ]);
  const store = {skaters,groups,sessions,skaterGroupEntries};
  return store;
}


(async()=>{
  const store = await getStore(db)

 await fs.writeFile('./skaterStore.json',JSON.stringify(store));
 process.exit()
})()