-- MySQL 8+ schema produced from UML (defaults accepted)
-- Charset and engine defaults
create database skill_Barter;
-- drop database skill_barter;
use skill_Barter;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1) Core users table (base for Student/Admin)
CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,              -- hashed password
  full_name VARCHAR(200) NOT NULL,
  display_name VARCHAR(150),
  phone VARCHAR(30),
  user_type ENUM('student','admin','guest') NOT NULL DEFAULT 'student',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_users_email (email),
  INDEX idx_users_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) Student subtype table (optional extra fields)
CREATE TABLE students (
  id INT UNSIGNED NOT NULL,                     -- references users(id)
  student_number VARCHAR(50) DEFAULT NULL,
  college VARCHAR(200) DEFAULT NULL,
  points_balance INT UNSIGNED NOT NULL DEFAULT 0, -- canonical balance
  rating DECIMAL(2,1) DEFAULT NULL,
  rating_count INT UNSIGNED DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_students_student_number (student_number),
  CHECK (rating IS NULL OR (rating >= 0.0 AND rating <= 5.0)),
  CONSTRAINT fk_students_user FOREIGN KEY (id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) Admin subtype table
CREATE TABLE admins (
  id INT UNSIGNED NOT NULL,                     -- references users(id)
  admin_role VARCHAR(100) DEFAULT 'moderator',
  permissions JSON DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_admins_user FOREIGN KEY (id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) Skills (reusable skill definitions)
CREATE TABLE skills (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  skill_name VARCHAR(150) NOT NULL,
  category VARCHAR(100) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY ux_skills_name (skill_name),
  INDEX idx_skills_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5) Junction: user_skills (many-to-many between users and skills)
CREATE TABLE user_skills (
  user_id INT UNSIGNED NOT NULL,
  skill_id INT UNSIGNED NOT NULL,
  proficiency_level ENUM('beginner','intermediate','advanced','expert') NOT NULL DEFAULT 'beginner',
  years_experience TINYINT UNSIGNED DEFAULT NULL,
  verified_by INT UNSIGNED DEFAULT NULL,
  verified_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, skill_id),
  CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_skills_verified_by FOREIGN KEY (verified_by) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_user_skills_proficiency (proficiency_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6) Optional table for recording skill verification requests/history
CREATE TABLE skill_verifications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  skill_id INT UNSIGNED NOT NULL,
  requester_id INT UNSIGNED NOT NULL,    -- user who requested verification
  verifier_id INT UNSIGNED DEFAULT NULL, -- admin or other verifier
  status ENUM('requested','approved','rejected','revoked') NOT NULL DEFAULT 'requested',
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_skill_verifications_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_skill_verifications_requester FOREIGN KEY (requester_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_skill_verifications_verifier FOREIGN KEY (verifier_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_skill_verifications_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7) Projects table
CREATE TABLE projects (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  created_by INT UNSIGNED NULL,   -- must allow NULL for ON DELETE SET NULL
  project_name VARCHAR(200) NOT NULL,
  description TEXT DEFAULT NULL,
  status ENUM('open','in_progress','completed','cancelled') NOT NULL DEFAULT 'open',
  starts_at DATETIME DEFAULT NULL,
  ends_at DATETIME DEFAULT NULL,
  max_participants INT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),

  CONSTRAINT fk_projects_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id)
      ON DELETE SET NULL ON UPDATE CASCADE,

  INDEX idx_projects_status (status),
  INDEX idx_projects_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 8) Project participants (junction table for project <-> users)
CREATE TABLE project_participants (
  project_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  role VARCHAR(100) DEFAULT 'member',  -- e.g., owner, contributor, viewer
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  left_at DATETIME DEFAULT NULL,
  PRIMARY KEY (project_id, user_id),
  CONSTRAINT fk_proj_participants_project FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_proj_participants_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_proj_participants_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9) Collaborations (requests/agreements between users, optionally tied to project)
CREATE TABLE collaborations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  requester_id INT UNSIGNED NOT NULL,   -- who requested collaboration
  provider_id INT UNSIGNED NOT NULL,    -- who will provide/accept
  project_id INT UNSIGNED DEFAULT NULL,
  title VARCHAR(200) DEFAULT NULL,
  details TEXT DEFAULT NULL,
  status ENUM('pending','accepted','rejected','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_collab_requester FOREIGN KEY (requester_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_collab_provider FOREIGN KEY (provider_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_collab_project FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_collaborations_status (status),
  INDEX idx_collaborations_requester (requester_id),
  INDEX idx_collaborations_provider (provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10) Transactions (points earning/redeeming/transfers/log)
CREATE TABLE transactions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  from_user_id INT UNSIGNED DEFAULT NULL, -- nullable in case of system_award
  to_user_id INT UNSIGNED DEFAULT NULL,
  transaction_type ENUM('earn','redeem','transfer','admin_adjustment') NOT NULL,
  amount INT UNSIGNED NOT NULL,           -- integer points
  balance_after INT UNSIGNED DEFAULT NULL, -- optional snapshot of recipient balance
  description TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_transactions_from_user FOREIGN KEY (from_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_transactions_to_user FOREIGN KEY (to_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_transactions_to_user (to_user_id),
  INDEX idx_transactions_from_user (from_user_id),
  INDEX idx_transactions_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11) Conversations (for messages / threads)
CREATE TABLE conversations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  subject VARCHAR(255) DEFAULT NULL,
  is_group BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12) Messages (individual messages, optionally grouped by conversation)
CREATE TABLE messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id INT UNSIGNED DEFAULT NULL,
  sender_id INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_messages_conversation (conversation_id),
  INDEX idx_messages_sender (sender_id),
  INDEX idx_messages_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13) Notifications
CREATE TABLE notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  notification_type VARCHAR(100) NOT NULL,
  payload JSON DEFAULT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_type (notification_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14) Feedback / Ratings (user -> user or user -> project)
CREATE TABLE feedback (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  from_user_id INT UNSIGNED NOT NULL,
  to_user_id INT UNSIGNED DEFAULT NULL,
  project_id INT UNSIGNED DEFAULT NULL,
  rating DECIMAL(2,1) NOT NULL,
  comment TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_feedback_from FOREIGN KEY (from_user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_feedback_to FOREIGN KEY (to_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_feedback_project FOREIGN KEY (project_id) REFERENCES projects(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CHECK (rating >= 0.0 AND rating <= 5.0),
  INDEX idx_feedback_to_user (to_user_id),
  INDEX idx_feedback_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE tasks (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  collaboration_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  status ENUM('todo','inprogress','done') NOT NULL DEFAULT 'todo',
  priority ENUM('Low','Medium','High') NOT NULL DEFAULT 'Medium',
  assignee_id INT UNSIGNED NOT NULL,
  due_date DATE DEFAULT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  CONSTRAINT fk_tasks_collab FOREIGN KEY (collaboration_id)
    REFERENCES collaborations(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_tasks_assignee FOREIGN KEY (assignee_id)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_tasks_status (status),
  INDEX idx_tasks_assignee (assignee_id)
);


CREATE TABLE achievements (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  points_reward INT UNSIGNED DEFAULT 0,
  icon VARCHAR(100) DEFAULT 'award',
  earned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_achievements_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE reports (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reporter_id INT UNSIGNED NOT NULL,
  reported_user_id INT UNSIGNED NOT NULL,
  issue VARCHAR(255) NOT NULL,
  status ENUM('pending','resolved','investigating','dismissed') NOT NULL DEFAULT 'pending',
  priority ENUM('Low','Medium','High') NOT NULL DEFAULT 'Medium',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id),

  CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_reports_reported_user FOREIGN KEY (reported_user_id)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_reports_status (status),
  INDEX idx_reports_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE announcements (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (admin_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

use skill_Barter;

SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE users
  ADD COLUMN avatar_url VARCHAR(255) DEFAULT NULL;

ALTER TABLE collaborations
  ADD COLUMN conversation_id INT UNSIGNED DEFAULT NULL AFTER requested_at,
  ADD INDEX idx_collaborations_conversation (conversation_id),
  ADD CONSTRAINT fk_collab_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversations(id)
      ON DELETE SET NULL
      ON UPDATE CASCADE;
      
      
USE skill_Barter;

-- 1. Extend user_type + moderation flags
ALTER TABLE users
  MODIFY user_type ENUM('student','admin','guest','mentor','trainer')
    NOT NULL DEFAULT 'student',
  ADD COLUMN shadow_banned TINYINT(1) NOT NULL DEFAULT 0 AFTER is_active,
  ADD COLUMN can_message TINYINT(1) NOT NULL DEFAULT 1 AFTER shadow_banned;

-- 2. Add featured flag to skills
ALTER TABLE skills
  ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 AFTER verified;

-- 3. Add admin_notes to collaborations
ALTER TABLE collaborations
  ADD COLUMN admin_notes TEXT DEFAULT NULL AFTER details;

-- 4. Add notes to skill_verifications
ALTER TABLE skill_verifications
  ADD COLUMN notes TEXT DEFAULT NULL AFTER status;

