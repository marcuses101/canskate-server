const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");
const app = require("../src/app");
const { makeSkatersArray } = require("./fixtures/skater.fixtures");
const { makeClubsArray } = require("./fixtures/club.fixtures");
const makeSkaterClubArray = require("./fixtures/skater_club.fixtures");

const skaters = makeSkatersArray();
const clubs = makeClubsArray();
const skaterClubLogs = makeSkaterClubArray();

describe("skater-club endpoints", () => {
  let db = {};
  function cleanup() {
    return db.raw(
      "TRUNCATE clubs, skaters, skater_club RESTART IDENTITY CASCADE"
    );
  }
  async function populate() {
    await db.into("clubs").insert(clubs);
    await db.into("skaters").insert(skaters);
    await db.into("skater_club").insert(skaterClubLogs);
  }

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    return app.set("db", db);
  });
  after("disconnect", () => db.destroy());

  beforeEach(cleanup);

  describe("POST /api/skater-club", () => {
    context("skaters, clubs populated. skater-club empty", () => {
      beforeEach("populate skaters, clubs", async () => {
        await db.into("skaters").insert(skaters);
        await db.into("clubs").insert(clubs);
      });
      afterEach(cleanup);
      it("responds with status 200 and the created entry", async () => {
        const entry = { skater_id: 1, club_id: 3 };
        const { body } = await supertest(app)
          .post("/api/skater-club")
          .send(entry);
        expect(body).to.eql({ ...entry, id: 1 });
      });
    });
  });

  describe("DELETE /api/skater-club", () => {
    context("database is populated", () => {
      beforeEach(populate);
      afterEach(cleanup);

      it("responds with status 200 and removes the entry", async () => {
        const entryToRemove = { skater_id: 1, club_id: 1, id: 1 };
        const expectedRemainingLogs = skaterClubLogs.filter(
          (log) => log.id !== entryToRemove.id
        );
        await supertest(app)
          .delete("/api/skater-club")
          .send(entryToRemove)
          .expect(200);
        const logs = await db.select("*").from("skater_club");
        expect(logs).to.eql(expectedRemainingLogs);
      });
    });
  });
});
