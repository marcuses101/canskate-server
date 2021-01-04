const ElementServices = {
  getElements(knex) {
    return knex("elements")
      .join(
        "checkmarks",
        "elements.checkmark_id",
        "checkmarks.id"
      )
      .join(
        "ribbons",
        "ribbons.id",
        "checkmarks.ribbon_id"
      )
      .select(
        "elements.description as element",
        "elements.id as element_id",
        "checkmarks.id as checkmark_id",
        "ribbons.id as ribbon_id",
        "ribbons.fundamental_area as fundamental",
        "ribbons.stage as badge_id",
      );
  },
};

module.exports = ElementServices;