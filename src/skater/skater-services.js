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
  getSkatersByClubId() {},
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
