CREATE TABLE canskate_checkmarks (
  id TEXT PRIMARY KEY,
  ribbon_id TEXT REFERENCES canskate_ribbons(id) ON DELETE CASCADE NOT NULL,
  total_elements INTEGER NOT NULL
)