const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");
const { makeClubsArray } = require("./club.fixtures");
const { makeSessionsArray } = require("./session.fixtures");
const { makeGroupArray } = require("./group.fixtures");
const app = require("../src/app");

const clubs = makeClubsArray();
const sessions = makeSessionsArray();
const groups = makeGroupArray();

describe("club endpoints", () => {
  let db;

  function cleanup() {
    return db.raw("TRUNCATE groups, sessions, clubs RESTART IDENTITY CASCADE");
  }

  function populate() {
      db.into("clubs").insert(clubs)
      db.into("sessions").insert(sessions)
      db.into("groups").insert(groups)
  }

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => {
    db.destroy();
  });

  beforeEach("populate database", populate);
  afterEach("truncate tables", cleanup);

  describe("GET /api/club", () => {
    context("given the database is empty", () => {
      it("responds with status 200 and an empty array",async () => {
        const { body } = await supertest(app).get('/api/club').expect(200);
        expect(body).to.eql([]);
      });
    });

    context("given the database is populated", () => {
      it("responds with 200 and the club object", async()=>{

      })
    });
  });
});
