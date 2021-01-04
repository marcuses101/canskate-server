const skaterSessionServices = {
  getAllEntries(knex){
    return knex.select("*").from("skater_session");
  },
  getEntriesByClubId(knex,club_id){
    return knex
    .from('clubs')
    .join('sessions',{'clubs.id':'sessions.club_id'})
    .join('skater_session', {'sessions.id':'skater_session.session_id'})
    .where('clubs.id', club_id)
    .select('skater_session.id', 'skater_session.skater_id', 'skater_session.session_id')
  },
  async addEntry(knex,skater_id,session_id){
    const rows = await knex.insert({skater_id,session_id}).into("skater_session").returning("*");
    return rows[0];
  },
  getEntryById(knex,id){
    return knex.select("*").from('skater_session').where({id}).first();
  },
  updateEntry(knex,id,entry){
    return knex('skater_session').where({id}).update(entry);
  },
  deleteEntry(knex,id){
    return knex('skater_session').where({id}).delete();
  },
  deleteEntryBySkaterIdClubId(knex,skater_id,session_id){
    return knex('skater_session').where({skater_id,session_id}).delete();
  }

}

module.exports = skaterSessionServices;