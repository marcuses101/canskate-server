const ElementServices = {
  getElements(knex) {
    return knex("canskate_elements")
      .join(
        "canskate_checkmarks",
        "canskate_elements.checkmark_id",
        "canskate_checkmarks.id"
      )
      .join(
        "canskate_ribbons",
        "canskate_ribbons.id",
        "canskate_checkmarks.ribbon_id"
      )
      .select(
        "canskate_elements.description as element",
        "canskate_elements.id as element_id",
        "canskate_checkmarks.id as checkmark_id",
        "canskate_ribbons.id as ribbon_id",
        "canskate_ribbons.fundamental_area as fundamental",
        "canskate_ribbons.stage as badge_id",
      );
  },
};

module.exports = ElementServices;