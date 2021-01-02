const ElementLogServices = {
  getLogs(knex) {
    return knex.select("*").from("skater_element_log");
  },
  getLogById(knex, id) {
    return knex.select("*").from("skater_element_log").where({ id }).first();
  },
  getLogsBySkaterId(knex,skater_id) {
    return knex.select("*").from("skater_element_log").where({skater_id});
  },
  async countCompletedElementsByCheckmark(knex, skater_id, checkmark_id) {
    const {count} = await knex("skater_element_log")
      .count()
      .where({skater_id})
      .where('element_id','LIKE',`${checkmark_id}%`)
      .first();
      return parseInt(count);
  },
  async insertLog(knex, log) {
    const rows = await knex
      .insert(log)
      .into("skater_element_log")
      .returning("*");
    return rows[0];
  },
  updateLog(knex, id, log) {
    return knex("skater_element_log").update(log).where({ id });
  },
  deleteLog(knex, id) {
    return knex("skater_element_log").where({ id }).delete();
  },
};

module.exports = ElementLogServices;
