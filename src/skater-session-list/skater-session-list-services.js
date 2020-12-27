const SkaterSessionListServices = {
  getAllEntries(knex){
    return knex.select("*").from("canskate_skater_session");
  },
  async insertSkaterIntoSession(knex,skater_id,session_id){
    const rows = await knex.insert({skater_id,session_id}).into("canskate_skater_session").returning("*");
    return rows[0];
  },
  getEntryById(knex,id){
    return knex.select("*").from('canskate_skater_session').where({id}).first();
  },
  updateEntry(knex,id,entry){
    return knex('canskate_skater_session').where({id}).update(entry);
  },
  deleteEntry(knex,id){
    return knex('canskate_skater_session').where({id}).delete();
  }
}

module.exports = {SkaterSessionListServices};