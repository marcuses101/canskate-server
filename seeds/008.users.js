

async function seedUsers(db){
  await db.into('users').insert([
    {
      username:'userOne',
      password:"$2b$10$lVoMocGhQ.gKmVoQVkSStOeFpDVZFtwVwgGUsQF.7rNtVhxEs7bl."
    },
    {
      username:'userTwo',
      password:'$2b$10$bHXwV.nHksU5BZ/aHphMOuPUAt56wWsilbnQ1EJtBze/R/3Rynh5W'
    },
    {
      username:'thinkful',
      password:'$2b$10$6fQ/eMi/BG8O7xw.MH1dq.AGaxi2bjUYgngnXmn6ykltMivEndV7e'
    },
    {
      username:'demo',
      password:'$2b$10$3Y.H6oWhhnUChe3occLd3uRH.jHKuxlHRjMHpLgsoCQw0mU1HKnTq'
    }
  ])
}

module.exports = {seedUsers}