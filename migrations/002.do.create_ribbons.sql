CREATE TYPE fundamental AS ENUM (
  'Balance', 'Control', 'Agility', 'Pre-Canskate'
);

CREATE TABLE ribbons (
  id TEXT PRIMARY KEY,
  fundamental_area fundamental,
  badge_id TEXT REFERENCES badges(id),
  checkmarks_required INTEGER NOT NULL,
  total_checkmarks INTEGER NOT NULL
);

INSERT INTO ribbons
  (id,fundamental_area, badge_id, checkmarks_required,total_checkmarks)
VALUES
  ('PRE','Pre-Canskate','PRE',8,8),
  ('1B','Balance',1,4,4),
  ('2B','Balance',2,4,4),
  ('3B','Balance',3,5,5),
  ('4B','Balance',4,5,7),
  ('5B','Balance',5,5,7),
  ('6B','Balance',6,6,8),
  ('1C','Control',1,3,3),
  ('2C','Control',2,3,4),
  ('3C','Control',3,5,5),
  ('4C','Control',4,5,6),
  ('5C','Control',5,6,7),
  ('6C','Control',6,6,8),
  ('1A','Agility',1,3,3),
  ('2A','Agility',2,4,4),
  ('3A','Agility',3,5,5),
  ('4A','Agility',4,5,6),
  ('5A','Agility',5,6,7),
  ('6A','Agility',6,6,8);

