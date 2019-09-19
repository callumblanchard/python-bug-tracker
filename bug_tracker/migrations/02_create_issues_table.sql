CREATE TABLE issues(
  id INTEGER PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  opened_datetime CHAR(26) DEFAULT (datetime('now')),
  closed_datetime CHAR(26),
  created_by INTEGER,
  assigned_to INTEGER,
  CONSTRAINT fk_users
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE SET NULL,
    FOREIGN KEY (assigned_to)
    REFERENCES users(id)
    ON DELETE SET NULL
)
