const RibbonLogServices = {
  getLogs(knex) {
    return knex.select("*").from("canskate_ribbon_log");
  },
  async insertLog(knex, log) {
    const rows = await knex
      .insert(log)
      .into("canskate_ribbon_log")
      .returning("*");
    return rows[0];
  },
  async countCompletedRibbonsByBadge(knex, skater_id, badge_id) {
    const { count } = await knex("canskate_ribbon_log")
      .count()
      .where({ skater_id })
      .where("ribbon_id", "LIKE", `${badge_id}%`)
      .first();
    return parseInt(count);
  },
  deleteLog(knex, id) {
    return knex("canskate_ribbon_log").where({ id }).delete();
  },
};

module.exports = RibbonLogServices;
