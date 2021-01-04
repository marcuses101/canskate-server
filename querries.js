require("dotenv").config();
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: 'postgresql://marcus@localhost/new_canskate'
});

(async () => {
  const groups = await db
  .from('clubs')
  .join('skater_club', 'clubs.id', '=', 'skater_club.club_id')
  .join('skaters', 'skaters.id', '=', 'skater_club.skater_id')
  .where('clubs.id',1)
  .select('skaters.id', 'skaters.fullname', 'skaters.gender', 'skaters.birthdate')
    console.log(groups)
})();
