const skaterGroupServices = {
  getAllEntries(knex){
    return knex.select("*").from("skater_group");
  },
  async addEntry(knex,skater_id,group_id){
    const rows = await knex.insert({skater_id,group_id}).into("skater_group").returning("*");
    return rows[0];
  },
  getEntriesByClubId(knex,club_id) {
    return knex.from('clubs')
    .where('clubs.id', club_id)
    .join('sessions', {'clubs.id':'sessions.club_id'})
    .join('groups', {'sessions.id':'groups.session_id'})
    .join('skater_group',{'skater_group.group_id':'groups.id'})
    .select('skater_group.id','skater_group.skater_id','skater_group.group_id')
  },
  getEntryById(knex,id){
    return knex.select("*").from('skater_group').where({id}).first();
  },
 async updateEntry(knex,skater_id, group_id, new_group_id){
    return (await knex('skater_group').where({skater_id,group_id}).update('group_id', new_group_id).returning('*'))[0];
  },
  deleteEntry(knex,id){
    return knex('skater_group').where({id}).delete();
  }
}

module.exports = skaterGroupServices;