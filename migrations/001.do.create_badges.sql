CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  ribbons_required INTEGER NULL
);

INSERT INTO badges (id, ribbons_required)
VALUES
('PRE', 1),
('1',3),
('2',3),
('3',3),
('4',3),
('5',3),
('6',3);