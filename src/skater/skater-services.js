const skaterServices = {
  getAllSkaters: (knex) => {
    return knex.select("*").from("skaters");
  },
  insertSkater: async (knex, skater) => {
    const rows = await knex
      .insert(skater)
      .into("skaters")
      .returning("*");
    return rows[0];
  },
  getSkaterById: (knex, id) => {
    return knex.select("*").from("skaters").where({ id }).first();
  },
  updateSkater: (knex, id, skater) => {
    return knex("skaters").where({ id }).update(skater);
  },
  deleteSkater: (knex, id) => {
    return knex("skaters").where({ id }).delete();
  },
};

module.exports = skaterServices