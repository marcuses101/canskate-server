CREATE TABLE skater_badge_log (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  skater_id INTEGER REFERENCES skaters(id) NOT NULL,
  badge_id TEXT REFERENCES badges(id) NOT NULL,
  date_completed TIMESTAMPTZ DEFAULT now() NOT NULL,
  date_distributed TIMESTAMPTZ,
  UNIQUE (skater_id, badge_id)
)