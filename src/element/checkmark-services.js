const CheckmarkServices = {
  getCheckmarks(knex) {
    return knex("checkmarks")
      .join(
        "ribbons",
        "checkmarks.ribbon_id",
        "ribbons.id"
      )
      .select(
        "checkmarks.id as checkmark_id",
        "ribbon_id",
        "total_elements"
      );
  },
  getCheckmarkById(knex,id){
    return knex.select("*").from('checkmarks').where({id}).first();
  }
};

module.exports = CheckmarkServices;
