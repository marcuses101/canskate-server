const { makeSessionsArray } = require("./fixtures/session.fixtures");
const { makeClubsArray } = require("./fixtures/club.fixtures");
const app = require("../src/app");
const knex = require("knex");
const supertest = require("supertest");
const { expect } = require("chai");

const clubs = makeClubsArray();
const sessions = makeSessionsArray();

describe("session endpoints", () => {
  let db;

  function cleanup() {
    return db.raw("TRUNCATE sessions, clubs RESTART IDENTITY CASCADE");
  }
  async function populate() {
    await db.into("clubs").insert(clubs);
    await db.into("sessions").insert(sessions);
  }

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: {
        connectionString: process.env.TEST_DATABASE_URL,
      },
    });
    app.set("db", db);
  });
  afterEach("truncate tables", cleanup);
  after("disconnect from db", () => {
    db.destroy();
  });

  describe("GET /api/session", () => {
    context("given the database is empty", () => {
      it("returns status 200 with an empty array", async () => {
        const { body } = await supertest(app).get("/api/session").expect(200);
        expect(body).to.eql([]);
      });
    });

    context("given the database is populated", () => {
      beforeEach(populate);
      afterEach(cleanup);
      it("returns 200 with an array of session objects", async () => {
        const { body } = await supertest(app).get("/api/session").expect(200);
        expect(body).to.eql(sessions);
      });
    });
  });

  describe("POST /api/session", () => {
    context("session table is empty", () => {
      beforeEach("populate clubs table", () => db.into("clubs").insert(clubs));
      afterEach(cleanup);
      it("responds with 400 and an error object if a field is missing", async () => {
        const sessionObject = {
          day: "Wednesday",
          start_time: "12:00:00",
          // duration in missing
          club_id: 1,
        };
        const errorObject = {
          error: { message: `Error: duration is required` },
        };

        const { body } = await supertest(app)
          .post("/api/session")
          .send(sessionObject)
          .expect(400);
        expect(body).to.eql(errorObject);
      });

      it("responds with 201 and the created session object", async () => {
        const sessionObject = {
          day: "Wednesday",
          start_time: "12:00:00",
          duration: 55,
          club_id: 1,
        };
        const { body } = await supertest(app)
          .post("/api/session")
          .send(sessionObject)
          .expect(201);
        expect(body).to.eql({ ...sessionObject, id: 1 });
      });
    });
  });

  describe("PATCH /api/session/:id", () => {
    context("given the database is populated", () => {
      beforeEach(populate);
      afterEach(cleanup);

      it("responds with 200 and the updated session object", async () => {
        const id = 3;
        const updateObject = { start_time: "01:00:00" };
        const expectedSession = {
          ...sessions.find((session) => session.id === id),
          ...updateObject,
        };
        const { body } = await supertest(app)
          .patch(`/api/session/${id}`)
          .send(updateObject)
          .expect(200);
        expect(body).to.eql(expectedSession);
      });
    });
  });

  describe("DELETE /api/session/:id,", () => {
    context("given the database is populated", () => {
      beforeEach(populate);
      afterEach(cleanup);

      it("responds with 200 and the session is removed", async () => {
        const id = 4;
        const expectedSessions = sessions.filter(
          (session) => session.id !== id
        );
        await supertest(app).delete(`/api/session/${id}`).expect(200);
        const remainingSessions = await db.select("*").from("sessions");
        expect(remainingSessions).to.eql(expectedSessions);
      });
    });
  });
});
