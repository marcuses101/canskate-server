const SkaterGroupListServices = {
  getAllEntries(knex){
    return knex.select("*").from("canskate_group_list");
  },
  async insertSkaterIntoGroup(knex,skater_id,group_id){
    const rows = await knex.insert({skater_id,group_id}).into("canskate_group_list").returning("*");
    return rows[0];
  },
  getEntryById(knex,id){
    return knex.select("*").from('canskate_group_list').where({id}).first();
  },
  updateEntry(knex,id,group){
    return knex('canskate_group_list').where({id}).update(group);
  },
  deleteEntry(knex,id){
    return knex('canskate_group_list').where({id}).delete();
  }
}

module.exports = SkaterGroupListServices;