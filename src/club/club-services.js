const clubServices = {
   getClubs(knex){
     return knex.select('*').from('clubs')
   },
   getClubsByUsername(knex, username){
    return knex('users').where({username})
          .join('user_club', 'users.id', '=', 'user_club.user_id')
          .join('clubs', 'clubs.id', '=', 'user_club.club_id')
          .select('clubs.id', 'clubs.name');
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