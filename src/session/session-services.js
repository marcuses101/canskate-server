const SessionServices = {
  getAllSessions(knex){
    return knex.select('*').from('sessions');
  },
  async insertSession(knex,session){
    const rows = await knex.insert(session).into('sessions').returning('*');
    return rows[0];
  },
  getSessionsByClubId(knex,club_id){
    return  knex
    .from('clubs')
    .join('sessions', 'clubs.id', '=', 'sessions.club_id')
    .where('clubs.id',club_id)
    .select('sessions.id','sessions.day','sessions.start_time','sessions.duration','sessions.club_id')
  }
  ,
  getSessionById(knex,id){
    return knex.select('*').from("sessions").where({id}).first();
  },
  async updateSession(knex,id,session){
    return (await knex('sessions').where({id}).update(session).returning('*'))[0] ;
  },
  deleteSkater(knex,id){
    return knex('sessions').where({id}).delete();
  }
}

module.exports = SessionServices;