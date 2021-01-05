require("dotenv").config();
const { makeSessionsArray } = require("../test/fixtures/session.fixtures");
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

//strip ids;
const clubs = makeSessionsArray().map(
  ({ day, duration, start_time, club_id }) => ({
    day,
    duration,
    start_time,
    club_id,
  })
);

(async () => {
  await db.insert(clubs).into("sessions");
  process.exit();
})().catch((e) => {
  console.log(e);
  process.exit();
});
