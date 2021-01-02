require("dotenv").config();
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: 'postgresql://marcus@localhost/new_canskate'
});

(async () => {
  const groups = await db
  .from('clubs')
  .join('sessions', 'clubs.id', '=', 'sessions.club_id')
  .where('clubs.id',1)
  .select('sessions.id','sessions.day','sessions.start_time','sessions.duration','sessions.club_id')
    console.log(groups)
})();
