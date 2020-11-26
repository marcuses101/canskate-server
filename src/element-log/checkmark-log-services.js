const CheckmarkLogServices = {
  getLogs(knex) {
    return knex.select("*").from("canskate_checkmark_log");
  },
  async countCompletedCheckmarksByRibbon(knex, skater_id, ribbon_id) {
    const { count } = await knex("canskate_checkmark_log")
      .count()
      .where({ skater_id })
      .where("checkmark_id", "LIKE", `${ribbon_id}%`)
      .first();
    return parseInt(count);
  },
  async insertLog(knex, log) {
    const rows = await knex
      .insert(log)
      .into("canskate_checkmark_log")
      .returning("*");
    return rows[0];
  },
  deleteLog(knex, id) {
    return knex("canskate_checkmark_log").where({ id }).delete();
  },
 async deleteLogBySkaterCheckmark(knex, skater_id, checkmark_id) {
    const rows = await knex("canskate_checkmark_log")
      .where({ skater_id, checkmark_id })
      .delete()
      .returning('*');
      return rows[0];
  },
};

module.exports = CheckmarkLogServices;
