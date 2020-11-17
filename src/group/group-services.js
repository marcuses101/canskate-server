const GroupServices = {
  getAllGroups(knex){
    return knex.select("*").from("canskate_groups");
  },
  async insertGroup(knex,group){
    const rows = await knex.insert(group).into("canskate_groups").returning("*");
    return rows[0];
  },
  getGroupById(knex,id){
    return knex.select("*").from('canskate_groups').where({id}).first();
  },
  updateGroup(knex,id,group){
    return knex('canskate_groups').where({id}).update(group);
  },
  deleteGroup(knex,id){
    return knex('canskate_groups').where({id}).delete();
  }
}

module.exports = GroupServices;