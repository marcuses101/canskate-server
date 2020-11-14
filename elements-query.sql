SELECT e.description Element, c.id, r.stage as Badge, r.fundamental_area as Fundamental
FROM canskate_elements e
JOIN canskate_checkmarks c
ON e.checkmark_id = c.id
JOIN canskate_ribbons r
ON c.ribbon_id = r.id;