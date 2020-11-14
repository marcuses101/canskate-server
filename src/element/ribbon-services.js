const RibbonServices = {
  getRibbons(knex) {
    return knex.select("*").from("canskate_ribbons");
  },
  getRibbonById(knex, id) {
    return knex.select("*").from("canskate_ribbons").where({ id }).first();
  },
};

module.exports = RibbonServices;
