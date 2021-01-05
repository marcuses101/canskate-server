const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");
const app = require("../src/app");
const { makeSkatersArray } = require("./fixtures/skater.fixtures");
const { makeClubsArray } = require("./fixtures/club.fixtures");
const { makeSessionsArray } = require("./fixtures/session.fixtures");
const { makeGroupArray } = require("./fixtures/group.fixtures");
const makeSkaterGroupArray = require("./fixtures/skater_group.fixtures");

const skaters = makeSkatersArray();
const clubs = makeClubsArray();
const sessions = makeSessionsArray();
const groups = makeGroupArray();
const skaterGroupLogs = makeSkaterGroupArray();

describe("skater-group endpoints", () => {
  let db = {};
  function cleanup() {
    return db.raw(
      "TRUNCATE skaters, groups, sessions, clubs, skater_group RESTART IDENTITY CASCADE"
    );
  }
  async function populate() {
    await db.into("skaters").insert(skaters);
    await db.into("clubs").insert(clubs);
    await db.into("sessions").insert(sessions);
    await db.into("groups").insert(groups);
    await db.into('skater_group').insert(skaterGroupLogs)
  }

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    return app.set("db", db);
  });

  after(() => {
    db.destroy();
  });

  beforeEach(cleanup);
  afterEach(cleanup);

  describe("POST /api/skater-group", () => {
    context("clubs, sessions, groups populated. skater_group is empty", () => {
      beforeEach(populate);
      beforeEach(
        async () =>
          await db.raw("TRUNCATE skater_group RESTART IDENTITY CASCADE")
      );
      afterEach(cleanup);
      it("responds with status 201 and the created entry", async () => {
        const newLog = { skater_id: 5, group_id: 3 };
        const expectedLog = { ...newLog, id: 1 };
        const { body } = await supertest(app)
          .post("/api/skater-group")
          .send(newLog)
          .expect(201)
        expect(body).to.eql(expectedLog);
      });
    });
  });

  describe("PATCH /api/skater-group", () => {
    context("database is populated", () => {
      beforeEach(populate);
      afterEach(cleanup);

      it('responds with 200 and updates the entry',async()=>{
        const entry = skaterGroupLogs[0]
        const updateLog = {...entry, new_group_id: 2};
        const expectedLog = {...entry, group_id:2};
        await supertest(app).patch('/api/skater-group').send(updateLog).expect(200);
        const actualLog = await db.select('*').where({id:entry.id}).from('skater_group').first();
        expect(actualLog).to.eql(expectedLog)
      })
    });
  });
});
