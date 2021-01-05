const skaterClubServices = {
  getAllEntries(knex) {
    return knex.select("*").from("skater_club");
  },
  getEntryById(knex, id) {
    return knex.select("*").from("skater_club").where({ id }).first();
  },
  async addEntry(knex, skater_id, club_id) {
    return (
      await knex
        .insert({ skater_id, club_id })
        .into("skater_club")
        .returning("*")
    )[0];
  },
  deleteEntry(knex, skater_id, club_id) {
    return knex("skater_club").where({ skater_id, club_id }).delete();
  },
};

module.exports = skaterClubServices;
