CREATE TYPE days as ENUM (
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
);

CREATE TABLE sessions (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  day days NOT NULL,
  start_time TIME WITHOUT TIME ZONE,
  duration INTEGER NOT NULL,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE NOT NULL
);