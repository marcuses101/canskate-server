require("dotenv").config();
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});
const { seedClub } = require("./001.seed.clubs");
const { seedSessions } = require("./002.seed.sessions");
const { seedGroups } = require("./003.seed.groups");
const { seedSkaters } = require("./004.seed.skaters");
const { seedSkaterClub } = require("./005.seed.skater_club");
const { seedSkaterSession } = require("./006.seed.skater_session");
const { seedSkaterGroup } = require("./007.seed.skater_group");
const { seedUsers } = require("./008.users");
const { seedUserClub } = require("./009.user_club");

(async () => {
  try {
    await seedClub(db);
    await seedSessions(db);
    await seedGroups(db);
    await seedSkaters(db);
    await seedSkaterClub(db);
    await seedSkaterSession(db);
    await seedSkaterGroup(db);
    await seedUsers(db);
    await seedUserClub(db);
    process.exit();
  } catch(e){
    console.error(e)
  }
})();
