const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");
const groupServices = require("../src/group/group-services");
const { makeGroupArray } = require("./fixtures/group.fixtures");
const app = require("../src/app");

describe("/api/group endpoint", () => {
  let db = {};
  function cleanup() {
    return db.raw(
      "TRUNCATE sessions, groups RESTART IDENTITY CASCADE"
    );
  }
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    return app.set("db", db);
  });
  before("populate sessions table", async () => {


  });
  after("disconnect from database", () => {
    return db.destroy();
  });
  beforeEach("clear tables", cleanup);

  describe("GET /", () => {
    const groups = makeGroupArray(10);
    context("given the database contains groups", () => {
      beforeEach("populate groups", async () => {
        await db.insert(groups).into("groups");
      });
      afterEach("clear tables", cleanup);

      it("returns an array of all the groups", async () => {
        const res = await supertest(app).get("/api/group/").expect(200);
        expect(res.body).to.eql(
          groups.map((groupEntry, i) => {
            return { ...groupEntry, id: i + 1 };
          })
        );
      });
    });

    context("given the database is empty", () => {
      it("returns an empty array", async () => {
        const res = await supertest(app).get("/api/group/").expect(200);
        expect(res.body).to.eql([]);
      });
    });
  });
});
