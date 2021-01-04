const clubServices = {
   getClubs(knex){
     return knex.select('*').from('clubs')
   },
   getClubById(knex,id){
     return knex.select("*").from('clubs').where({id}).first();
   },
   async addClub(knex,club){
    return (await knex.into('clubs').insert(club).returning('*'))[0];
   },
   async updateClub(knex,id,name){
     return (await knex('clubs').where({id}).update({name}).returning("*"))[0]
   }

}

module.exports = clubServices