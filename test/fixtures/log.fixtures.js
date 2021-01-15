function makeSkaterElementLogArray() {
  return [
    {
      skater_id: 1,
      element_id: "1B11",
      date_completed: new Date("2021-01-03"),
    },
    {
      skater_id: 1,
      element_id: "1B21",
      date_completed: new Date("2021-01-03"),
    },
    {
      skater_id: 1,
      element_id: "1B31",
      date_completed: new Date("2021-01-03"),
    },
    {
      skater_id: 1,
      element_id: "1B41",
      date_completed: new Date("2021-01-03"),
    },
    {
      skater_id: 1,
      element_id: "1C11",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      element_id: "1C12",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      element_id: "1C21",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      element_id: "1C31",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      element_id: "1A11",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      element_id: "1A12",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      element_id: "1A21",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      element_id: "1A31",
      date_completed: new Date("2021-01-02"),
    },
  ];
}
function makeSkaterCheckmarkLogArray() {
  return [
    {
      skater_id: 1,
      checkmark_id: "1B1",
      date_completed: new Date("2021-01-03"),
    },
    {
      skater_id: 1,
      checkmark_id: "1B2",
      date_completed: new Date("2021-01-03"),
    },
    {
      skater_id: 1,
      checkmark_id: "1B3",
      date_completed: new Date("2021-01-03"),
    },
    {
      skater_id: 1,
      checkmark_id: "1B4",
      date_completed: new Date("2021-01-03"),
    },
    {
      skater_id: 1,
      checkmark_id: "1C1",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      checkmark_id: "1C2",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      checkmark_id: "1C3",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      checkmark_id: "1A1",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      checkmark_id: "1A2",
      date_completed: new Date("2021-01-02"),
    },
    {
      skater_id: 1,
      checkmark_id: "1A3",
      date_completed: new Date("2021-01-02"),
    },
  ];
}
function makeSkaterRibbonLogArray() {
  return [
    { skater_id: 1, ribbon_id: "1B", date_completed: new Date("2021-01-03") },
    { skater_id: 1, ribbon_id: "1C", date_completed: new Date("2021-01-03") },
    { skater_id: 1, ribbon_id: "1A", date_completed: new Date("2021-01-03") },
  ];
}
function makeSkaterBadgeLogArray() {
  return [
    { skater_id: 1, badge_id: "1", date_completed: new Date("2021-01-03") },
  ];
}

module.exports = {
  makeSkaterElementLogArray,
  makeSkaterCheckmarkLogArray,
  makeSkaterRibbonLogArray,
  makeSkaterBadgeLogArray,
};
