const faker = require('faker');

console.log(faker.date.weekday());

function generateSession(){
  return {
    day: faker.date.weekday(),
    start_time: faker.time
  }
}
console.log(generateSession())