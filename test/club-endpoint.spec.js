const knex = require("knex");
const app = require("../src/app");
const { makeClubsArray } = require("./fixtures/club.fixtures");
const { makeSessionsArray } = require("./fixtures/session.fixtures");
const { makeGroupArray } = require("./fixtures/group.fixtures");
const { makeSkatersArray } = require("./fixtures/skater.fixtures");
const makeSkaterClubArray = require("./fixtures/skater_club.fixtures");
const makeSkaterGroupArray = require("./fixtures/skater_group.fixtures");
const makeSkaterSessionArray = require("./fixtures/skater_session.fixtures");
const makeUserClubArray = require("./fixtures/user_club.fixtures");
const makeUserArray = require("./fixtures/user.fixtures");
const supertest = require("supertest");
const { expect } = require("chai");
const clubs = makeClubsArray();
const sessions = makeSessionsArray();
const groups = makeGroupArray();
const skaters = makeSkatersArray();
const skaterClubEntries = makeSkaterClubArray();
const skaterGroupEntries = makeSkaterGroupArray();
const skaterSessionEntries = makeSkaterSessionArray();
const users = makeUserArray();
const userClubEntries = makeUserClubArray();

describe("club endpoints", () => {
  let db;

  function cleanup() {
    return db.raw(
      "TRUNCATE groups, sessions, clubs, skaters, skater_club, skater_session, skater_group, users, user_club RESTART IDENTITY CASCADE"
    );
  }

  async function populate() {
    await db.into("users").insert(users);
    await db.into("skaters").insert(skaters);
    await db.into("clubs").insert(clubs);
    await db.into("user_club").insert(userClubEntries);
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
      beforeEach("populate users table", () => {
        return db.into("users").insert(users);
      });
      afterEach(cleanup);
      it("responds with status 200 and an empty array", async () => {
        const { body: jwt } = await supertest(app)
          .post("/api/user/login")
          .send({ username: "userOne", password: "password" })
          .expect(200);
        const { body } = await supertest(app)
          .get("/api/club")
          .set("Authorization", `Bearer ${jwt.accessToken}`)
          .expect(200);
        expect(body).to.eql([]);
      });
    });

    context("given the database is populated", () => {
      beforeEach("populate database", populate);
      afterEach("truncate tables", cleanup);

      it("responds with 200 and an array of clubs associated with the user", async () => {
        const user = users[0];
        const expectedClubs = userClubEntries
          .filter(({ user_id }) => user_id === user.id)
          .map(({ club_id }) => clubs.find(({ id }) => id === club_id));
        const { body: jwt } = await supertest(app)
          .post("/api/user/login")
          .send({ username: "userOne", password: "password" })
          .expect(200);
        const { body } = await supertest(app)
          .get("/api/club")
          .set("Authorization", `Bearer ${jwt.accessToken}`)
          .expect(200);
        expect(body).to.eql(expectedClubs);
      });
    });
  });

  describe("POST /api/club", () => {
    context("given the database is empty", () => {
      beforeEach("populate users", () => {
        return db.into("users").insert(users);
      });
      afterEach("truncate tables", cleanup);
      it("responds with 400 if name is missing", async () => {
        const { body: jwt } = await supertest(app)
          .post("/api/user/login")
          .send({ username: "userOne", password: "password" })
          .expect(200);

        return supertest(app)
          .post("/api/club")
          .set("Authorization", `Bearer ${jwt.accessToken}`)
          .send({})
          .expect(400);
      });

      it("responds with status 201 and the club object", async () => {
        const club = { name: "Marcus' cool club" };

        const { body: jwt } = await supertest(app)
          .post("/api/user/login")
          .send({ username: "userOne", password: "password" })
          .expect(200);

        const { body } = await supertest(app)
          .post("/api/club")
          .send(club)
          .set("Authorization", `Bearer ${jwt.accessToken}`)
          .expect(201);
        expect(body).to.eql({ id: 1, ...club });
      });
    });
  });

  describe("GET /api/club/:id", () => {
    context("given the clubs table is empty", () => {
      beforeEach("populate users, user_club", async () => {
        await db.into("users").insert(users);
      });
      afterEach("truncate tables", cleanup);
      it("responds with status 403", async () => {
        const id = 2;
        const { body: jwt } = await supertest(app)
          .post("/api/user/login")
          .send({ username: "userOne", password: "password" })
          .expect(200);
        await supertest(app)
          .get(`/api/club/${id}`)
          .set("Authorization", `Bearer ${jwt.accessToken}`)
          .expect(403);
      });
    });

    context("given the database is populated", () => {
      beforeEach("populate", populate);
      afterEach("clean tables", cleanup);

      it("responds with status 200 and an the application data for specified club", async () => {
        const { body: jwt } = await supertest(app)
          .post("/api/user/login")
          .send({ username: "userOne", password: "password" })
          .expect(200);

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
          .set("Authorization", `Bearer ${jwt.accessToken}`)
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
      it("responds with 401 if access token isn't provided", async () => {
        const id = 2;
        await supertest(app)
          .patch(`/api/club/${id}`)
          .send({ name: "Bob's club" })
          .expect(401, "access token null");
      });
    });

    context("database is populated", () => {
      beforeEach("populate", populate);
      afterEach("clean tables", cleanup);
      it("responds with 200 and the updated club", async () => {
        const { body: jwt } = await supertest(app)
          .post("/api/user/login")
          .send({ username: "userOne", password: "password" })
          .expect(200);
        const id = 1;
        const name = "new club name";
        const { body } = await supertest(app)
          .patch(`/api/club/${id}`)
          .send({ name })
          .set("Authorization", `Bearer ${jwt.accessToken}`)
          .expect(200);
        expect(body).to.eql({ id: 1, name });
      });
    });
  });
});
