require("dotenv").config();
const { makeClubsArray } = require("../test/fixtures/club.fixtures");
// const knex = require("knex");
// const db = knex({
//   client: "pg",
//   connection: process.env.DATABASE_URL,
// });

const clubs = makeClubsArray().map(({ name }) => ({ name }));
async function seedClub(db){
    await db.insert(clubs).into('clubs')
}



module.exports = {seedClub};

