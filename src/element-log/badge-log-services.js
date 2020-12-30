const BadgeLogServices = {
  getLogs(knex) {
    return knex.select("*").from("canskate_badge_log");
  },
  getLogsBySkaterId(knex,skater_id){
    return knex.select("*").from('canskate_badge_log').where({skater_id})
  },
  async insertLog(knex, log) {
    const rows = await knex
      .insert(log)
      .into("canskate_badge_log")
      .returning("*");
    return rows[0];
  },
  deleteLog(knex, id) {
    return knex("canskate_badge_log").where({ id }).delete();
  },
  async deleteLogBySkaterBadge(knex, skater_id, badge_id) {
    const rows = await knex("canskate_badge_log")
      .where({ skater_id, badge_id })
      .delete()
      .returning("*");
    return rows[0];
  },
};

module.exports = BadgeLogServices;
