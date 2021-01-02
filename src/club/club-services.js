const clubServices = {
   getClubs(knex){
     return knex.select('*').from('clubs')
   },
   getClubById(knex,id){
     return knex.select("*").from('clubs').where({id}).first();
   }
   
}

module.exports = clubServices