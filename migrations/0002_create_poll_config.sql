CREATE TABLE IF NOT EXISTS poll_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  a_option TEXT NOT NULL,
  b_option TEXT NOT NULL,
  c_option TEXT NOT NULL,
  created_at TEXT NOT NULL
);
