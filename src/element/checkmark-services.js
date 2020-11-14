const CheckmarkServices = {
  getCheckmarks(knex) {
    return knex("canskate_checkmarks")
      .join(
        "canskate_ribbons",
        "canskate_checkmarks.ribbon_id",
        "canskate_ribbons.id"
      )
      .select(
        "canskate_checkmarks.id as checkmark_id",
        "ribbon_id",
        "total_elements"
      );
  },
  getCheckmarkById(knex,id){
    return knex.select("*").from('canskate_checkmarks').where({id}).first();
  }
};

module.exports = CheckmarkServices;
