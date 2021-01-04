const RibbonServices = {
  getRibbons(knex) {
    return knex.select("*").from("ribbons");
  },
  getRibbonById(knex, id) {
    return knex.select("*").from("ribbons").where({ id }).first();
  },
};

module.exports = RibbonServices;
