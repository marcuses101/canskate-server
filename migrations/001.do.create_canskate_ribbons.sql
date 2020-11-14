CREATE TYPE fundamental AS ENUM (
  'Balance', 'Control', 'Agility', 'Pre-Canskate'
);

CREATE TABLE canskate_ribbons (
  id TEXT PRIMARY KEY,
  fundamental_area fundamental,
  stage INTEGER,
  checkmarks_required INTEGER NOT NULL
);