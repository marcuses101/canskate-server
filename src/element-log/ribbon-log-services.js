const RibbonServices = require("../element/ribbon-services");

const RibbonLogServices = {
  async insertlog(knex, log) {
    const rows = await knex.insert(log).into("canskate_ribbon_log");
    return rows[0];
  },
  async verifyCheckmarks(knex, log) {
    const { ribbon_id, skater_id, date_completed } = log;
    const ribbon_log = { ribbon_id, skater_id, date_completed };
    const { checkmarks_required } = await RibbonServices.getRibbonById(
      knex,
      ribbon_id
    );
    const { count: checkmarksCompleted } = await knex("canskate_checkmark_log")
      .count()
      .where({ skater_id })
      .where("checkmark_id", "LIKE", `${ribbon_id}%`)
      .first();

    if (checkmarks_required == checkmarksCompleted)
      await RibbonLogServices.insertlog(knex,ribbon_log);
  },
};

module.exports = RibbonLogServices;
