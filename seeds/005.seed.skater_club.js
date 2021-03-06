require("dotenv").config();
// const knex = require("knex");
// const db = knex({
//   client: "pg",
//   connection: process.env.DATABASE_URL,
// });

async function seedSkaterClub (db) {
  const [skaterIds, sessionIds] = await Promise.all([
    db.select("id").from("skaters"),
    db.select("id").from("clubs"),
  ]);
  const sessionListEntries = skaterIds.map((entry) => {
    return {
      skater_id: entry.id,
      club_id: sessionIds[Math.floor(Math.random() * sessionIds.length)].id,
    };
  });
  await db.insert(sessionListEntries).into("skater_club");
}

// (async () => {
//   try {
//     const [skaterIds, sessionIds] = await Promise.all([
//       db.select("id").from("skaters"),
//       db.select("id").from("clubs"),
//     ]);
//     const sessionListEntries = skaterIds.map((entry) => {
//       return {
//         skater_id: entry.id,
//         club_id: sessionIds[Math.floor(Math.random() * sessionIds.length)].id,
//       };
//     });
//     await db.insert(sessionListEntries).into("skater_club");
//     process.exit();
//   } catch (error) {
//     console.log(error);
//     process.exit();
//   }
// })();

module.exports = {seedSkaterClub}