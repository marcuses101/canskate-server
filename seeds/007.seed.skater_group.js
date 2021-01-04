require("dotenv").config();
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

try {
  (async () => {
    const skaterSessionEntries = await db.select("*").from("skater_session");
    await Promise.all(
      skaterSessionEntries.map(async ({ skater_id, session_id }) => {
        const group_ids = await db
          .from("sessions")
          .join("groups", { "sessions.id": "groups.session_id" })
          .where("sessions.id", session_id)
          .select("groups.id");

        if (group_ids.length) {
          const group_id =
            group_ids[Math.floor(group_ids.length * Math.random())].id;
          await db.into("skater_group").insert({ skater_id, group_id });
        }
      })
    );
    process.exit();
  })();
} catch (e) {
  console.log(e);
  process.exit();
}
