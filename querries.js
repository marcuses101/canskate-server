require("dotenv").config();
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

(async () => {
  const count = await db("canskate_checkmark_log")
    .count()
    .where({skater_id: 5})
    .where("checkmark_id", "LIKE", `1A%`)
    .first();

    console.log(count)
})();
