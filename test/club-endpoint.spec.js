const knex = require("knex");
const { makeClubsArray } = require("./fixtures/club.fixtures");
const { makeSessionsArray } = require("./fixtures/session.fixtures");
const { makeGroupArray } = require("./fixtures/group.fixtures");
const app = require("../src/app");
const { makeSkatersArray } = require("./fixtures/skater.fixtures");
const makeSkaterClubArray = require("./fixtures/skater_club.fixtures");
const makeSkaterGroupArray = require("./fixtures/skater_group.fixtures");
const makeSkaterSessionArray = require("./fixtures/skater_session.fixtures");
const supertest = require("supertest");
const { expect } = require("chai");

const clubs = makeClubsArray();
const sessions = makeSessionsArray();
const groups = makeGroupArray();
const skaters = makeSkatersArray();
const skaterClubEntries = makeSkaterClubArray();
const skaterGroupEntries = makeSkaterGroupArray();
const skaterSessionEntries = makeSkaterSessionArray();

describe("club endpoints", () => {
  let db;

  function cleanup() {
    return db.raw(
      "TRUNCATE groups, sessions, clubs, skaters, skater_club, skater_session, skater_group RESTART IDENTITY CASCADE"
    );
  }

  async function populate() {
    await db.into("skaters").insert(skaters);
    await db.into("clubs").insert(clubs);
    await db.into("sessions").insert(sessions);
    await db.into("groups").insert(groups);
    await db.into("skater_club").insert(skaterClubEntries);
    await db.into("skater_session").insert(skaterSessionEntries);
    await db.into("skater_group").insert(skaterGroupEntries);
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
  beforeEach(cleanup);
  afterEach("truncate tables", cleanup);

  describe("GET /api/club", () => {
    context("given the database is empty", () => {
      it("responds with status 200 and an empty array", async () => {
        const { body } = await supertest(app).get("/api/club").expect(200);
        expect(body).to.eql([]);
      });
    });

    context("given the database is populated", () => {
      beforeEach("populate database", populate);
      afterEach("truncate tables", cleanup);

      it("responds with 200 and an array of clubs", async () => {
        const { body } = await supertest(app).get("/api/club").expect(200);
        expect(body).to.eql(clubs);
      });
    });
  });

  describe("POST /api/club", () => {
    context("given the database is empty", () => {
      afterEach("truncate tables", cleanup);
      it("responds with 400 if name is missing", async () => {
        return supertest(app).post("/api/club").send({}).expect(400);
      });

      it("responds with status 201 and the club object", async () => {
        const club = { name: "Marcus' cool club" };
        const { body } = await supertest(app)
          .post("/api/club")
          .send(club)
          .expect(201);
        expect(body).to.eql({ id: 1, ...club });
      });
    });
  });

  describe("GET /api/club/:id", () => {
    context("given the database is empty", () => {
      it("responds with status 404", async () => {
        const id = 2;
        await supertest(app).get(`/api/club/${id}`).expect(404);
      });
    });

    context("given the database is populated", () => {
      beforeEach("populate", populate);
      afterEach("clean tables", cleanup);

      it("responds with status 200 and an the application data for specified club", async () => {
        const id = 1;
        const expectedName = clubs.find((club) => club.id === id).name;
        const expectedSessions = sessions.filter(
          ({ club_id }) => club_id === id
        );
        const expectedGroups = groups.filter((group) =>
          expectedSessions.some((session) => group.session_id === session.id)
        );
        const expectedSkaterSessionEntries = skaterSessionEntries.filter(
          ({ session_id }) =>
            expectedSessions.some(({ id }) => id === session_id)
        );
        const expectedSkaterGroupEntries = skaterGroupEntries.filter(
          ({ group_id }) => expectedGroups.some(({ id }) => id === group_id)
        );
        const expectedSkatersWithLogs = skaterClubEntries
          .filter(({ club_id }) => club_id === id)
          .map(({ skater_id }) => {
            const foundSkater = skaters.find((skater) => {
              return skater.id === skater_id;
            });
            return {
              ...foundSkater,
              elementLog: [],
              checkmarkLog: [],
              ribbonLog: [],
              badgeLog: [],
            };
          });
        const expectedObject = {
          id,
          name: expectedName,
          sessions: expectedSessions,
          groups: expectedGroups,
          skaterSessionEntries: expectedSkaterSessionEntries,
          skaterGroupEntries: expectedSkaterGroupEntries,
          skatersWithLogs: expectedSkatersWithLogs,
        };
        const { body } = await supertest(app)
          .get(`/api/club/${id}`)
          .expect(200);
        expect({
          ...body,
          skatersWithLogs: body.skatersWithLogs.map((skater) => ({
            ...skater,
            birthdate: skater.birthdate.slice(0, 10),
          })),
        }).to.eql(expectedObject);
      });
    });
  });

  describe("PATCH /api/club/:id", () => {
    context("database is empty", () => {
      it("responds with 404", async () => {
        const id = 2;
        const { body } = await supertest(app)
          .patch(`/api/club/${id}`)
          .send({ name: "Bob's club" })
          .expect(404);
        expect(body).to.eql({
          error: { message: `club with id ${id} not found` },
        });
      });
    });

    context("database is populated", () => {

      beforeEach("populate", populate);
      afterEach("clean tables", cleanup);
      it("responds with 200 and the updated club", async () => {
        const id = 1;
        const name = "new club name";
        const { body } = await supertest(app)
          .patch(`/api/club/${id}`)
          .send({ name })
          .expect(200);
        expect(body).to.eql({ id: 1, name });
      });
    });
  });
});
