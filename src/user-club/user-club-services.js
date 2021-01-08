const userClubServices = {
  addEntry(knex,user_id,club_id){
    return knex.into('user_club').insert({user_id,club_id})
  }
}

module.exports = userClubServices;