CREATE TYPE colors as ENUM (
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Blue',
  'Purple',
  'Turquoise'
);

CREATE TABLE canskate_groups (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  group_color colors NOT NULL,
  session_id INTEGER REFERENCES canskate_sessions(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (group_color, session_id)
);