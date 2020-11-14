CREATE TABLE canskate_elements (
  id TEXT PRIMARY KEY,
  checkmark_id TEXT REFERENCES canskate_checkmarks(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL
)