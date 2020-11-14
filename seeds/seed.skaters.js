require('dotenv').config();
const faker = require('faker')
const knex = require('knex');
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});

function genderGenerator(){
  const genders = ['Male','Female']
  return genders[Math.floor(Math.random()*2)]
}

function generateSkater(){
  return {
    fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: genderGenerator(),
    birthdate: faker.date.between('2005-01-01','2016-01-01')
  }
}

const skaters = [...Array(200)].map(()=>generateSkater());

(async()=>{
  await db.insert(skaters).into('skaters')
  process.exit();
})().catch(e=>{
  console.log(e)
  process.exit();
})