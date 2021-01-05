const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");
const app = require("../src/app");

describe("log endpoints", () => {
  let db = {};
  function cleanup() {
    return db.raw(
      "TRUNCATE skater_badge_log, skater_ribbon_log, skater_checkmark_log, skater_element_log RESTART IDENTITY CASCADE"
    );
  }
  async function populate() {}

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    return app.set("db", db);
  });

  beforeEach(cleanup);

  describe("GET /api/log", () => {});
  describe("POST /api/log", () => {});
  describe("GET /api/log/:id", () => {});
  describe("PATCH /api/log/:id", () => {});
  describe("DELETE /api/log/:id", () => {});
});
