import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, 'tracker.db'));
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS applications (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 company TEXT NOT NULL, role TEXT NOT NULL, jd_link TEXT, jd_text TEXT,
 location TEXT, job_type TEXT, work_mode TEXT, source TEXT, salary TEXT,
 notes TEXT, current_stage TEXT NOT NULL DEFAULT 'Wishlist',
 applied_at TEXT, deadline TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS stage_history (
 id INTEGER PRIMARY KEY AUTOINCREMENT, application_id INTEGER NOT NULL,
 from_stage TEXT, to_stage TEXT NOT NULL, note TEXT, source TEXT DEFAULT 'Manual',
 changed_at TEXT NOT NULL DEFAULT (datetime('now')),
 FOREIGN KEY(application_id) REFERENCES applications(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS reminders (
 id INTEGER PRIMARY KEY AUTOINCREMENT, application_id INTEGER NOT NULL,
 title TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'Follow-up', due_at TEXT NOT NULL,
 notes TEXT, completed INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 FOREIGN KEY(application_id) REFERENCES applications(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS interviews (
 id INTEGER PRIMARY KEY AUTOINCREMENT, application_id INTEGER NOT NULL,
 round_name TEXT NOT NULL, interview_type TEXT, scheduled_at TEXT,
 difficulty INTEGER, performance INTEGER, result TEXT, reflection TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 FOREIGN KEY(application_id) REFERENCES applications(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS interview_questions (
 id INTEGER PRIMARY KEY AUTOINCREMENT, interview_id INTEGER NOT NULL,
 question TEXT NOT NULL, topic TEXT, difficulty INTEGER, solved INTEGER DEFAULT 0, answer_notes TEXT,
 FOREIGN KEY(interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS ai_analyses (
 id INTEGER PRIMARY KEY AUTOINCREMENT, application_id INTEGER NOT NULL,
 analysis_type TEXT NOT NULL, result_json TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 FOREIGN KEY(application_id) REFERENCES applications(id) ON DELETE CASCADE
);
`);
export default db;
