const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");
const app = require("../src/app");
const { makeSkatersArray } = require("./fixtures/skater.fixtures");
const { makeClubsArray } = require("./fixtures/club.fixtures");
const { makeSessionsArray } = require("./fixtures/session.fixtures");
const makeSkaterSessionArray = require("./fixtures/skater_session.fixtures");

const skaters = makeSkatersArray();
const clubs = makeClubsArray();
const sessions = makeSessionsArray();
const skaterSessionLogs = makeSkaterSessionArray();

describe("skater-session endpoints", () => {
  let db = {};
  function cleanup() {
    return db.raw(
      "TRUNCATE skaters, clubs, sessions, skater_session RESTART IDENTITY CASCADE"
    );
  }
  async function populate() {
    await db.into("clubs").insert(clubs);
    await db.into("skaters").insert(skaters);
    await db.into("sessions").insert(sessions);
    await db.into("skater_session").insert(skaterSessionLogs);
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

  describe("POST /api/skater-session", () => {
    context("skaters, clubs, sessions populated. skater_session empty", () => {
      beforeEach(async () => {
        await db.into("clubs").insert(clubs);
        await db.into("skaters").insert(skaters);
        await db.into("sessions").insert(sessions);
      });

      it("responds with status 201 and the created entry", async () => {
        const newEntry = { skater_id: 4, session_id: 2 };
        const { body } = await supertest(app)
          .post("/api/skater-session")
          .send(newEntry)
          .expect(201);
        expect(body).to.eql({ ...newEntry, id: 1 });
      });
    });
  });

  describe("DELETE /api/skater-session/", () => {
    context("database is populated", () => {
      beforeEach(populate);
      afterEach(cleanup);

      it("responds with 200 and deletes the entry by skater_id and session_id", async () => {
        const entryToDelete = skaterSessionLogs[3];
        await supertest(app)
          .delete("/api/skater-session")
          .send(entryToDelete)
          .expect(200);
        const expectedLogs = skaterSessionLogs.filter(
          ({ id }) => id !== entryToDelete.id
        );
        const actualLogs = await db.select("*").from("skater_session");
        expect(expectedLogs).to.eql(actualLogs);
      });
    });
  });
});
