const CheckmarkServices = require('../element/checkmark-services')

const CheckmarkLogServices = {
  getLogs() {},
  getLogById() {},
  async verifyElements(knex, log) {
    // verify canskate_checkmarks.total_elements
    const {checkmark_id, skater_id, date_completed} = log;
    const checkmark_log = {skater_id, checkmark_id, date_completed}
    const {total_elements} = await CheckmarkServices.getCheckmarkById(knex,checkmark_id);
    const {count: completedInCheckmark} = await knex('canskate_element_log')
    .count()
    .where({skater_id})
    .where('element_id', 'LIKE', `${checkmark_id}%`)
    .first();
    if (total_elements == completedInCheckmark) await CheckmarkLogServices.insertLog(knex, checkmark_log);
  },
  async insertLog(knex, log) {
    const rows = await knex.insert(log).into('canskate_checkmark_log').returning('*');
    return rows[0];
  },
  deleteLog() {},
};

module.exports = CheckmarkLogServices;
