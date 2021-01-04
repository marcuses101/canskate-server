const faker = require('faker')

function genderGenerator(){
  const genders = ['Male','Female']
  return genders[Math.floor(Math.random()*2)]
}

function generateSkater(_,id){
  return {
    id: (id !== undefined)?id+1:undefined,
    fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: genderGenerator(),
    birthdate: faker.date.between('2005-01-01','2016-01-01').toLocaleDateString()
  }
}

function makeSkatersArray (){
  return [...Array(10)].map(generateSkater)
}

module.exports = {makeSkatersArray,generateSkater};