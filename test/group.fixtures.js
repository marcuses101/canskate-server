const colors = [
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "Turquoise",
];

function generateGroup (){
  return {
    group_color: colors[Math.floor(Math.random()*colors.length)],
    session_id: Math.ceil(Math.random()*5)
  }
}

function makeGroupArray(arraySize) {
  return [...Array(10)].map(generateGroup);
}


module.exports = {makeGroupArray}
