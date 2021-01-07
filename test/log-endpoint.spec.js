const { expect } = require("chai");
const dayjs = require("dayjs");
const supertest = require("supertest");
const knex = require("knex");
const app = require("../src/app");
const { makeSkatersArray } = require("./fixtures/skater.fixtures");
const {
  makeSkaterElementLogArray,
  makeSkaterCheckmarkLogArray,
  makeSkaterRibbonLogArray,
  makeSkaterBadgeLogArray,
} = require("./fixtures/log.fixtures");

const skaters = makeSkatersArray();
const skaterElementLogs = makeSkaterElementLogArray();
const skaterCheckmarkLogs = makeSkaterCheckmarkLogArray();
const skaterRibbonLogs = makeSkaterRibbonLogArray();
const skaterBadgeLogs = makeSkaterBadgeLogArray();

describe("log endpoints", () => {
  let db = {};
  function cleanup() {
    return db.raw(
      "TRUNCATE skaters, skater_element_log, skater_checkmark_log, skater_ribbon_log, skater_badge_log RESTART IDENTITY CASCADE"
    );
  }
  async function populate() {
    await db.into("skaters").insert(skaters);
    await Promise.all([
      db.into("skater_element_log").insert(skaterElementLogs),
      db.into("skater_checkmark_log").insert(skaterCheckmarkLogs),
      db.into("skater_ribbon_log").insert(skaterRibbonLogs),
      db.into("skater_badge_log").insert(skaterBadgeLogs),
    ]);
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

  describe("POST /api/logs", () => {
    context("skaters populated, skater_*_log is empty", () => {
      beforeEach(async () => {
        await db.into("skaters").insert(skaters);
      });
      afterEach(cleanup);
      it("responds with status 200 and a object of logs ", async () => {
        const newLog = { skater_id: 2, element_id: "1B11" };
        const expectedResponse = {
          element_log: {
            ...newLog,
            id: 1,
            date_completed: dayjs().format("YYYY-MM-DD"),
          },
          checkmark_log: {
            checkmark_id: "1B1",
            skater_id: 2,
            date_completed: dayjs().format("YYYY-MM-DD"),
            id: 1,
          },
          ribbon_log: {},
          badge_log: {},
        };
        const { body } = await supertest(app).post("/api/log").send(newLog);
        console.log(body.element_log.date_completed);
        body.element_log.date_completed = dayjs(
          body.element_log.date_completed
        ).format("YYYY-MM-DD");
        body.checkmark_log.date_completed = dayjs(
          body.checkmark_log.date_completed
        ).format("YYYY-MM-DD");
        expect(body).to.eql(expectedResponse);
      });
    });
  });

  describe("PATCH /api/logs", () => {
    context("database is populated", () => {
      beforeEach(populate);
      afterEach(cleanup);

      it("updates the ribbon log date_distributed", async () => {
        const updateObject = {
          log_type: "ribbon",
          id: 1,
          date_distributed: new Date(),
        };
        const expectedLog = {
          ...skaterRibbonLogs.find(({ ribbon_id }) => ribbon_id === "1B"),
          date_distributed: dayjs().format("YYYY-MM-DD"),
          id: 1,
        };
        const { body } = await supertest(app)
          .patch("/api/log")
          .send(updateObject)
          .expect(200);
        body.date_distributed = dayjs(body.date_distributed).format(
          "YYYY-MM-DD"
        );
        body.date_completed = dayjs(body.date_completed)
          .locale()
          .format("YYYY-MM-DD");
        expect(body).to.eql(expectedLog);
      });

      it("updates the badge log date_distributed", async () => {
        const updateObject = {
          log_type: "badge",
          id: 1,
          date_distributed: new Date(),
        };
        const expectedLog = {
          ...skaterBadgeLogs.find(({ badge_id }) => badge_id === "1"),
          date_distributed: dayjs().format("YYYY-MM-DD"),
          id: 1,
        };

        const { body } = await supertest(app)
          .patch("/api/log")
          .send(updateObject)
          .expect(200);
        body.date_distributed = dayjs(body.date_distributed).format(
          "YYYY-MM-DD"
        );
        body.date_completed = dayjs(body.date_completed).format("YYYY-MM-DD");
        expect(body).to.eql(expectedLog);
      });
    });
  });

  describe("DELETE /api/logs", () => {
    context("database is populated", () => {
      beforeEach(populate);
      afterEach(cleanup);

      it("responds with status 200 and removes the appropriate logs across log tables", async () => {
        const id = 1;
        const expectedElementLogs = skaterElementLogs.filter(
          ({ element_id }) => element_id !== "1B11"
        );
        const expectedCheckmarkLogs = skaterCheckmarkLogs.filter(
          ({ checkmark_id }) => checkmark_id !== "1B1"
        );
        const expectedRibbonLogs = skaterRibbonLogs.filter(
          ({ ribbon_id }) => ribbon_id !== "1B"
        );
        const expectedBadgeLogs = skaterBadgeLogs.filter(
          ({ badge_id }) => badge_id !== "1"
        );
        await supertest(app).delete(`/api/log/${id}`).expect(200);
        const actualElementLogs = (
          await db
            .select("skater_id", "element_id", "date_completed")
            .from("skater_element_log")
        ).map((log) => ({
          ...log,
          date_completed: dayjs(log.date_completed).format("YYYY-MM-DD"),
        }));
        const actualCheckmarkLogs = (
          await db
            .select("skater_id", "checkmark_id", "date_completed")
            .from("skater_checkmark_log")
        ).map((log) => ({
          ...log,
          date_completed: dayjs(log.date_completed).format("YYYY-MM-DD"),
        }));
        const actualRibbonLogs = (
          await db
            .select("skater_id", "ribbon_id", "date_completed")
            .from("skater_ribbon_log")
        ).map((log) => ({
          ...log,
          date_completed: dayjs(log.date_completed).format("YYYY-MM-DD"),
        }));
        const actualBadgeLogs = (
          await db
            .select("skater_id", "badge_id", "date_completed")
            .from("skater_badge_log")
        ).map((log) => ({
          ...log,
          date_completed: dayjs(log.date_completed).format("YYYY-MM-DD"),
        }));
        expect(actualElementLogs).to.eql(expectedElementLogs);
        expect(actualCheckmarkLogs).to.eql(expectedCheckmarkLogs);
        expect(actualRibbonLogs).to.eql(expectedRibbonLogs);
        expect(actualBadgeLogs).to.eql(expectedBadgeLogs);
      });
    });
  });
});
