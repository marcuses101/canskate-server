const CheckmarkLogServices = {
  getLogs(knex) {
    return knex.select("*").from("skater_checkmark_log");
  },
  getLogsBySkaterId(knex,skater_id){
    return knex.select('*').from("skater_checkmark_log").where({skater_id})
  },
  async countCompletedCheckmarksByRibbon(knex, skater_id, ribbon_id) {
    const { count } = await knex("skater_checkmark_log")
      .count()
      .where({ skater_id })
      .where("checkmark_id", "LIKE", `${ribbon_id}%`)
      .first();
    return parseInt(count);
  },
  async insertLog(knex, log) {
    const rows = await knex
      .insert(log)
      .into("skater_checkmark_log")
      .returning("*");
    return rows[0];
  },
  deleteLog(knex, id) {
    return knex("skater_checkmark_log").where({ id }).delete();
  },
 async deleteLogBySkaterCheckmark(knex, skater_id, checkmark_id) {
    const rows = await knex("skater_checkmark_log")
      .where({ skater_id, checkmark_id })
      .delete()
      .returning('*');
      return rows[0];
  },
};

module.exports = CheckmarkLogServices;
