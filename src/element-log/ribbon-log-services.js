const RibbonLogServices = {
  getLogs(knex) {
    return knex.select("*").from("skater_ribbon_log");
  },
  getLogsBySkaterId(knex,skater_id){
    return knex.select('*').from('skater_ribbon_log').where({skater_id})
  }
  ,
  async insertLog(knex, log) {
    const rows = await knex
      .insert(log)
      .into("skater_ribbon_log")
      .returning("*");
    return rows[0];
  },
  async countCompletedRibbonsByBadge(knex, skater_id, badge_id) {
    const { count } = await knex("skater_ribbon_log")
      .count()
      .where({ skater_id })
      .where("ribbon_id", "LIKE", `${badge_id}%`)
      .first();
    return parseInt(count);
  },
  deleteLog(knex, id) {
    return knex("skater_ribbon_log").where({ id }).delete();
  },
  async deleteLogBySkaterRibbon(knex, skater_id, ribbon_id) {
    const rows = await knex("skater_ribbon_log")
      .where({ skater_id, ribbon_id })
      .delete()
      .returning("*");
    return rows[0];
  },
};

module.exports = RibbonLogServices;
