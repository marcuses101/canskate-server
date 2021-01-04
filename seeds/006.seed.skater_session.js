require("dotenv").config();
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

try {
  (async () => {
    const skaterClubEntries = await db.select("*").from("skater_club");
    await Promise.all(
      skaterClubEntries.map(async ({ skater_id, club_id }) => {
        const session_ids = await db
          .from("clubs")
          .join("sessions", { "sessions.club_id": "clubs.id" })
          .where("clubs.id", club_id)
          .select("sessions.id");

        const session_id =
          session_ids[Math.floor(session_ids.length * Math.random())].id;

        await db.into("skater_session").insert({ skater_id, session_id });
      })
    );
    process.exit();
  })();
} catch (e) {
  console.log(e);
  process.exit();
}
