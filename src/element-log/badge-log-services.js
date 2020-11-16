const BadgeLogServices = {
  getLogs(knex) {
    return knex.select("*").from("canskate_badge_log");
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
};

module.exports = BadgeLogServices;
