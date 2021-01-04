const skaterServices = {
  getAllSkaters(knex) {
    return knex.select("*").from("skaters");
  },
  async insertSkater(knex, skater) {
    const rows = await knex.insert(skater).into("skaters").returning("*");
    return rows[0];
  },
  getSkaterById(knex, id) {
    return knex.select("*").from("skaters").where({ id }).first();
  },
  getSkatersByClubId(knex, club_id){
    return knex
    .from('clubs')
    .join('skater_club', 'clubs.id', '=', 'skater_club.club_id')
    .join('skaters', 'skaters.id', '=', 'skater_club.skater_id')
    .where('clubs.id',club_id)
    .select('skaters.id', 'skaters.fullname', 'skaters.gender', 'skaters.birthdate')
  },
  async updateSkater(knex, id, skater) {
    return (
      await knex("skaters").where({ id }).update(skater).returning("*")
    )[0];
  },
  async deleteSkater(knex, id) {
    return knex("skaters").where({ id }).delete();
  },
};

module.exports = skaterServices;
