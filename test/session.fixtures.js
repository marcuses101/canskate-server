function makeSessionsArray(){
  return [{
    id:1,
    day:'Monday',
    start_time:'12:00:00',
    duration:60,
    club_id:1
  },
  {
    id:2,
    day:'Tuesday',
    start_time:'17:30:00',
    duration:45,
    club_id:2
  },
  {
    id:3,
    day:'Sunday',
    start_time:'10:30:00',
    duration:55,
    club_id:1
  },
  {
    id:4,
    day: 'Saturday',
    start_time: '09:00:00',
    duration: 60,
    club_id: 4
  },
  {
    id:5,
    day: 'Sunday',
    start_time: '13:00:00',
    duration: 50,
    club_id: 3
  }
]
}

module.exports = {makeSessionsArray}