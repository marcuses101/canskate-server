const userServices = {
  async addUser(knex,user){
    return (await knex.into('users').insert(user).returning('*'))[0];
  },
  async getUserByUsername(knex,username){
    return knex.select('*').from('users').where({username});
  }
}

module.exports = userServices;