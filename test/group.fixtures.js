const colors = [
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "Turquoise",
];

function makeGroupArray() {
  return [
    {
      id: 1,
      group_color: "Yellow",
      session_id: 1,
    },
    {
      id: 2,
      group_color: "Purple",
      session_id: 3,
    },
    { id: 3, group_color: "Yellow", session_id: 4 },
    {
      id: 4,
      group_color: "Green",
      session_id: 1,
    },
    { id: 5, group_color: "Red", session_id: 4 },
    { id: 6, group_color: "Blue", session_id: 4 },
    { id: 7, group_color: "Red", session_id: 3 },
    { id: 8, group_color: "Turquoise", session_id: 2 },
    { id: 9, group_color: "Turquoise", session_id: 3 },
    { id: 10, group_color: "Blue", session_id: 2 },
  ];
}

module.exports = { makeGroupArray };
