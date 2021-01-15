async function seedUserClub(db) {
  await db.into('user_club').insert([
    {
      user_id: 1,
      club_id: 1,
    },
    {
      user_id: 2,
      club_id: 2,
    },
    {
      user_id: 3,
      club_id: 3,
    },
    {
      user_id: 3,
      club_id: 4,
    },
    {
      user_id:4,
      club_id:4
    }
  ]);
}

module.exports = {seedUserClub};
