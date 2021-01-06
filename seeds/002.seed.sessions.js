require("dotenv").config();
const { makeSessionsArray } = require("../test/fixtures/session.fixtures");
// const knex = require("knex");
// const db = knex({
//   client: "pg",
//   connection: process.env.DATABASE_URL,
// });

//strip ids;
const sessions = makeSessionsArray().map(
  ({ day, duration, start_time, club_id }) => ({
    day,
    duration,
    start_time,
    club_id,
  })
);

async function seedSessions(db) {
    await db.insert(sessions).into('sessions')
}

// (async () => {
//   await seedSessions(db)
//   process.exit();
// })().catch((e) => {
//   console.log(e);
//   process.exit();
// });

module.exports = {seedSessions}