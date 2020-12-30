const {expect} = require('chai')
const supertest = require('supertest')
const knex = require('knex')
const {makeClubsArray} = require("./club.fixtures")
const {makeGroupArray} = require('./group.fixtures')
const app = require('../src/app')

const clubs = makeClubsArray();
const groups = makeGroupArray(10);

describe.only('club endpoints',()=>{
  let db;

  async function cleanup(){
    await db.raw('TRUNCATE canskate_groups, canskate_sessions, canskate_clubs, RESTART IDENTITY CASCADE')
  }

  async function populate(){
    
  }

  before('make knex instance', ()=>{
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set("db",db);
  })

  after('disconnect from db', ()=>{
    db.destroy();
  })

  describe('GET /api/club', ()=>{
    context('given the database is empty',()=>{

    })
  })
})