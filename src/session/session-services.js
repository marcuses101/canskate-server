const SessionServices = {
  getAllSessions(knex){
    return knex.select('*').from('canskate_sessions');
  },
  async insertSession(knex,session){
    const rows = await knex.insert(session).into('canskate_sessions').returning('*');
    return rows[0];
  },
  getSessionById(knex,id){
    return knex.select('*').from("canskate_sessions").where({id}).first();
  },
  async updateSession(knex,id,session){
    return (await knex('canskate_sessions').where({id}).update(session).returning('*'))[0] ;
  },
  deleteSkater(knex,id){
    return knex('canskate_sessions').where({id}).delete();
  }
}

module.exports = SessionServices;