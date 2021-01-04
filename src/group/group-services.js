const groupServices = {
  getAllGroups(knex){
    return knex.select("*").from("groups");
  },
  async insertGroup(knex,group){
    const rows = await knex.insert(group).into("groups").returning("*");
    return rows[0];
  },
  getGroupById(knex,id){
    return knex.select("*").from('groups').where({id}).first();
  },
  getGroupsByClubId(knex,club_id){
    return knex
    .from('clubs')
    .join('sessions', 'clubs.id', '=', 'sessions.club_id')
    .join('groups', 'sessions.id', '=', 'groups.session_id')
    .where('clubs.id',club_id)
    .select('groups.id as id', 'groups.group_color', 'groups.session_id')
  },
  updateGroup(knex,id,group){
    return knex('groups').where({id}).update(group);
  },
  deleteGroup(knex,id){
    return knex('groups').where({id}).delete();
  }
}

module.exports = groupServices;