const ElementLogServices = {
  getLogs(knex) {
    return knex.select("*").from("canskate_element_log");
  },
  getLogById(knex, id) {
    return knex.select("*").from("canskate_element_log").where({ id }).first();
  },
  async insertLog(knex, log) {
    const rows = await knex
      .insert(log)
      .into("canskate_element_log")
      .returning("*");
    return rows[0];
  },
  updateLog(knex, id, log) {
    return knex("canskate_element_log").update(log).where({ id });
  },
  deleteLog(knex, id) {
    return knex("canskate_element_log").where({ id }).delete();
  },
};

module.exports = ElementLogServices;
