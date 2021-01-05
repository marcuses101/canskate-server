const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");
const { makeGroupArray } = require("./fixtures/group.fixtures");
const app = require("../src/app");
const { makeClubsArray } = require("./fixtures/club.fixtures");
const { makeSessionsArray } = require("./fixtures/session.fixtures");

const clubs = makeClubsArray();
const sessions = makeSessionsArray();
const groups = makeGroupArray();

describe("group endpoints", () => {
  let db = {};
  function cleanup() {
    return db.raw("TRUNCATE clubs, sessions, groups RESTART IDENTITY CASCADE");
  }
  async function populate() {
    await db.into("clubs").insert(clubs);
    await db.into("sessions").insert(sessions);
    await db.into("groups").insert(groups);
  }

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    return app.set("db", db);
  });

  after("disconnect from database", () => {
    return db.destroy();
  });

  beforeEach("clear tables", cleanup);

  describe("GET /api/group", () => {
    context("given the database contains groups", () => {
      beforeEach(populate);
      afterEach("clear tables", cleanup);

      it("returns an array of all the groups", async () => {
        const res = await supertest(app).get("/api/group/").expect(200);
        expect(res.body).to.eql(groups);
      });
    });

    context("given the database is empty", () => {
      it("returns an empty array", async () => {
        const res = await supertest(app).get("/api/group/").expect(200);
        expect(res.body).to.eql([]);
      });
    });

    describe("POST /api/group", () => {
      context(
        "given the groups table is empty; clubs and sessions tables populated",
        () => {
          beforeEach("populate clubs, sessions tables", async () => {
            await db.into("clubs").insert(clubs);
            await db.into("sessions").insert(sessions);
          });

          afterEach(cleanup);

          it("responds with status 201 and the created group object", async () => {
            const groupToSubmit = {
              group_color: "Red",
              session_id: 1,
            };
            const { body } = await supertest(app)
              .post("/api/group")
              .send(groupToSubmit)
              .expect(201);
            expect(body).to.eql({ ...groupToSubmit, id: 1 });
          });
        }
      );
    });

    describe("GET /api/group/:id", () => {
      context("given the database is populated", () => {
        beforeEach(populate);
        afterEach(cleanup);
        it("responds with status 200 and the requested group object", async () => {
          const id = 5;
          const expectedGroup = groups.find((group) => group.id === id);
          const { body } = await supertest(app)
            .get(`/api/group/${id}`)
            .expect(200);
          expect(body).to.eql(expectedGroup);
        });
      });

      context("given the database is empty", () => {
        it("responds with status 400 and an error object", async () => {
          const id = 5;

          const { body } = await supertest(app)
            .get(`/api/group/${id}`)
            .expect(400);
          expect(body).to.eql({
            error: { message: `Group with id ${id} does not exist` },
          });
        });
      });
    });

    describe("DELETE /api/group/:id", () => {
      context("given the database is populated", () => {
        beforeEach(populate);
        afterEach(cleanup);

        it("responds with status 200 and removes the group", async () => {
          const id = 5;
          const expectedGroups = groups.filter((group) => group.id !== id);
          await supertest(app).delete(`/api/group/${id}`).expect(200);
          const databaseGroups = await db.select("*").from("groups");
          expect(databaseGroups).to.eql(expectedGroups);
        });
      });
    });

    describe("PATCH /api/group/:id", () => {
      context("given the database is populated", () => {
        beforeEach(populate);
        afterEach(cleanup);

        it("responds with status 200 and updates the group", async () => {
          const id = 3;
          const updateObject = { group_color: "Turquoise" };
          const expectedGroupObject = {
            id,
            group_color: "Turquoise",
            session_id: 4,
          };
          await supertest(app)
            .patch(`/api/group/${id}`)
            .send(updateObject)
            .expect(200);
          const updatedEntry = await db
            .select("*")
            .from("groups")
            .where({ id })
            .first();
          expect(updatedEntry).to.eql(expectedGroupObject);
        });
      });
    });
  });
});
