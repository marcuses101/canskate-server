const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");
const { makeSkatersArray, generateSkater } = require("./fixtures/skater.fixtures");
const app = require("../src/app");

describe.only("/api/skater endpoints", () => {
  let db = {};

  const skaters = makeSkatersArray();

  function cleanup() {
    return db.raw(
      "TRUNCATE sessions, groups, skaters RESTART IDENTITY CASCADE"
    );
  }
  async function populateSkaters() {
    return await db.insert(skaters).into("skaters");
  }

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  after("disconnect from db", () => {
    return db.destroy();
  });

  context("Given there are folders and notes in the database", () => {
    before("Clean the tables", cleanup);

    describe("/api/skater route", () => {
      beforeEach("populate skaters table", populateSkaters);

      afterEach("cleanup", cleanup);

      it("GET responds with 200 and all the skaters", async () => {
        const res = await supertest(app).get("/api/skater").expect(200);
        const responseSkaters = res.body.map((skater) => ({
          ...skater,
          birthdate: new Date(skater.birthdate).toLocaleDateString(),
        }));
        const expectedSkaters = skaters.map((skater) => ({
          ...skater,
          elementLog: [],
          checkmarkLog: [],
          ribbonLog: [],
          badgeLog: [],
        }));
        expect(responseSkaters).to.eql(expectedSkaters);
      });
    });
    describe("/api/skater/:id route", () => {
      beforeEach("populate skaters table", populateSkaters);

      afterEach("cleanup", cleanup);

      it("PATCH responds with 200 and updates the skater", async () => {
        const id = 3;
        const expectedSkater = skaters.find((skater) => skater.id == id);
        expectedSkater.fullname = "George Washington";
        const { body: responseSkater } = await supertest(app)
          .patch(`/api/skater/${id}`)
          .send({ fullname: "George Washington" })
          .expect(200);
        responseSkater.birthdate = new Date(
          responseSkater.birthdate
        ).toLocaleDateString();
        expect(responseSkater).to.eql(expectedSkater);
      });

      it("DELETE responds with 204 and deletes the skater", async () => {
        const id = 2;
        const deletedSkaters = skaters.filter((skater) => skater.id != id);
        await supertest(app).delete(`/api/skater/${id}`).expect(204);
        const databaseSkaters = await db.select('*').from('skaters')
        expect(deletedSkaters).to.eql(
          databaseSkaters.map((skater) => ({
            ...skater,
            birthdate: new Date(skater.birthdate).toLocaleDateString(),
          }))
        );
      });
    });
  });
  context(`'skaters' database is empty`, () => {
    describe("/api/skater route", () => {
      afterEach("cleanup", cleanup);

      it("POST creates a skater, responding with 201 and the new skater", async () => {
        const skater = generateSkater();
        const res = await supertest(app)
          .post("/api/skater")
          .send(skater)
          .expect(201);
        expect(res.body.fullname).to.eql(skater.fullname);
        expect(res.body.gender).to.eql(skater.gender);
        expect(new Date(res.body.birthdate).toLocaleDateString()).to.eql(
          skater.birthdate
        );
        expect(res.body).to.have.property("id");
        await supertest(app).get(`/api/skater/${res.body.id}`).expect(res.body);
      });

      it("GET responds with 200 and an empty array", async () => {
        const res = await supertest(app).get("/api/skater").expect(200);
        expect(res.body).to.eql([]);
      });
    });
  });
});
