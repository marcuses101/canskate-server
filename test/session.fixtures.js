const faker = require('faker');


function generateSession(){
  return {
    day: faker.date.weekday(),
    start_time: faker.time
  }
}

module.exports = {generateSession}