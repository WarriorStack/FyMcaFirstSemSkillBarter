-- Seed script for skill_barter
-- WARNING: This will TRUNCATE data. Run on a test/development DB.
use skill_Barter;
SET FOREIGN_KEY_CHECKS = 0;

-- TRUNCATE in safe order
TRUNCATE TABLE achievements;
TRUNCATE TABLE activity;
TRUNCATE TABLE admins;
TRUNCATE TABLE announcements;
TRUNCATE TABLE certificates;
TRUNCATE TABLE collaborations;
TRUNCATE TABLE conversations;
TRUNCATE TABLE feedback;
TRUNCATE TABLE followers;
TRUNCATE TABLE messages;
TRUNCATE TABLE notifications;
TRUNCATE TABLE project_participants;
TRUNCATE TABLE projects;
TRUNCATE TABLE reports;
TRUNCATE TABLE skill_endorsements;
TRUNCATE TABLE skill_verifications;
TRUNCATE TABLE skills;
TRUNCATE TABLE students;
TRUNCATE TABLE tasks;
TRUNCATE TABLE timeline_events;
TRUNCATE TABLE transactions;
TRUNCATE TABLE user_achievements;
TRUNCATE TABLE user_skills;
TRUNCATE TABLE users;

-- Reset AUTO_INCREMENT where applicable
ALTER TABLE achievements AUTO_INCREMENT = 1;
ALTER TABLE activity AUTO_INCREMENT = 1;
ALTER TABLE announcements AUTO_INCREMENT = 1;
ALTER TABLE collaborations AUTO_INCREMENT = 1;
ALTER TABLE conversations AUTO_INCREMENT = 1;
ALTER TABLE feedback AUTO_INCREMENT = 1;
ALTER TABLE messages AUTO_INCREMENT = 1;
ALTER TABLE notifications AUTO_INCREMENT = 1;
ALTER TABLE projects AUTO_INCREMENT = 1;
ALTER TABLE reports AUTO_INCREMENT = 1;
ALTER TABLE skill_verifications AUTO_INCREMENT = 1;
ALTER TABLE skills AUTO_INCREMENT = 1;
ALTER TABLE tasks AUTO_INCREMENT = 1;
ALTER TABLE timeline_events AUTO_INCREMENT = 1;
ALTER TABLE transactions AUTO_INCREMENT = 1;
ALTER TABLE user_achievements AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- 1) users (20)
INSERT INTO users (id, email, password, full_name, display_name, phone, user_type, is_active, shadow_banned, can_message, created_at, updated_at, avatar_url)
VALUES
(1,'alice@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Alice Johnson','alicej','+911234567001','student',1,0,1,'2025-01-10 09:00:00','2025-11-01 10:00:00',NULL),
(2,'bob@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Bob Martinez','bobm','+911234567002','student',1,0,1,'2025-02-12 11:30:00','2025-11-02 11:30:00',NULL),
(3,'carol@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Carol Singh','carols','+911234567003','mentor',1,0,1,'2025-03-01 08:20:00','2025-11-03 08:20:00',NULL),
(4,'dave@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Dave Patel','davep','+911234567004','trainer',1,0,1,'2025-03-20 14:00:00','2025-11-04 14:00:00',NULL),
(5,'eve@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Eve Brown','eveb','+911234567005','student',1,0,1,'2025-04-05 09:45:00','2025-11-05 09:45:00',NULL),
(6,'frank@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Frank Zhao','frankz','+911234567006','student',1,0,1,'2025-04-10 10:00:00','2025-11-06 10:00:00',NULL),
(7,'grace@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Grace Lee','gracel','+911234567007','student',1,0,1,'2025-05-01 12:00:00','2025-11-07 12:00:00',NULL),
(8,'henry@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Henry Kim','henryk','+911234567008','mentor',1,0,1,'2025-05-10 08:30:00','2025-11-08 08:30:00',NULL),
(9,'irene@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Irene Gomez','ireneg','+911234567009','student',1,0,1,'2025-06-12 15:00:00','2025-11-09 15:00:00',NULL),
(10,'jack@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Jack O\'Neill','jacko','+911234567010','student',1,0,1,'2025-06-20 16:10:00','2025-11-10 16:10:00',NULL),
(11,'kate@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Kate Müller','katem','+911234567011','student',1,0,1,'2025-07-01 09:00:00','2025-11-11 09:00:00',NULL),
(12,'liam@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Liam Nguyen','liamn','+911234567012','student',1,0,1,'2025-07-10 11:00:00','2025-11-12 11:00:00',NULL),
(13,'mia@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Mia Rossi','miar','+911234567013','mentor',1,0,1,'2025-08-01 10:30:00','2025-11-13 10:30:00',NULL),
(14,'noah@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Noah Silva','noahs','+911234567014','student',1,0,1,'2025-08-11 09:00:00','2025-11-14 09:00:00',NULL),
(15,'olivia@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Olivia Chen','oliviac','+911234567015','student',1,0,1,'2025-09-01 13:00:00','2025-11-15 13:00:00',NULL),
(16,'peter@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Peter Ivanov','peterv','+911234567016','trainer',1,0,1,'2025-09-10 14:20:00','2025-11-16 14:20:00',NULL),
(17,'quinn@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Quinn Park','quinnp','+911234567017','student',1,0,1,'2025-10-01 09:30:00','2025-11-17 09:30:00',NULL),
(18,'rachel@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Rachel Green','rachelg','+911234567018','student',1,0,1,'2025-10-10 12:45:00','2025-11-18 12:45:00',NULL),
(19,'sam@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Sam Carter','samc','+911234567019','student',1,0,1,'2025-10-20 08:00:00','2025-11-19 08:00:00',NULL),
(20,'tina@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Tina Alvarez','tinaa','+911234567020','admin',1,0,1,'2025-11-01 09:00:00','2025-11-20 09:00:00',NULL);

-- 2) skills (20)
INSERT INTO skills (id, skill_name, category, description, verified, is_featured, created_at, updated_at)
VALUES
(1,'Web Development','Programming','Frontend & backend web development',0,0,'2025-01-01 09:00:00','2025-11-01 09:00:00'),
(2,'Graphic Design','Design','Creating visual content and branding',0,0,'2025-01-05 09:00:00','2025-11-02 09:00:00'),
(3,'Data Analysis','Data','Data cleaning, analysis and visualization',1,1,'2025-01-10 09:00:00','2025-11-03 09:00:00'),
(4,'Digital Marketing','Marketing','SEO, SEM, social media marketing',0,0,'2025-01-15 09:00:00','2025-11-04 09:00:00'),
(5,'UI/UX Design','Design','User interface and experience design',1,1,'2025-02-01 09:00:00','2025-11-05 09:00:00'),
(6,'Mobile Development','Programming','iOS and Android apps',0,0,'2025-02-05 09:00:00','2025-11-06 09:00:00'),
(7,'Project Management','Management','Planning and executing projects',0,0,'2025-02-10 09:00:00','2025-11-07 09:00:00'),
(8,'Copywriting','Writing','Marketing and technical copy',0,0,'2025-02-14 09:00:00','2025-11-08 09:00:00'),
(9,'Machine Learning','Data','ML models and pipelines',1,0,'2025-02-20 09:00:00','2025-11-09 09:00:00'),
(10,'Photography','Media','Product and portrait photography',0,0,'2025-03-01 09:00:00','2025-11-10 09:00:00'),
(11,'Video Editing','Media','Post-production and editing',0,0,'2025-03-05 09:00:00','2025-11-11 09:00:00'),
(12,'DevOps','Infrastructure','CI/CD, Docker, Kubernetes',1,0,'2025-03-10 09:00:00','2025-11-12 09:00:00'),
(13,'SQL','Data','Relational DB design and queries',1,1,'2025-03-15 09:00:00','2025-11-13 09:00:00'),
(14,'Public Speaking','Soft Skill','Talks, presentations and workshops',0,0,'2025-03-20 09:00:00','2025-11-14 09:00:00'),
(15,'Cloud Architecture','Infrastructure','Designing cloud systems',1,0,'2025-04-01 09:00:00','2025-11-15 09:00:00'),
(16,'Illustration','Design','Vector and raster illustrations',0,0,'2025-04-05 09:00:00','2025-11-16 09:00:00'),
(17,'Cybersecurity','Security','Security practices and audits',0,0,'2025-04-10 09:00:00','2025-11-17 09:00:00'),
(18,'Product Management','Management','Product discovery and roadmaps',0,0,'2025-04-15 09:00:00','2025-11-18 09:00:00'),
(19,'Translation','Writing','Language translation services',0,0,'2025-04-20 09:00:00','2025-11-19 09:00:00'),
(20,'3D Modeling','Design','3D assets and modeling',0,0,'2025-04-25 09:00:00','2025-11-20 09:00:00');

-- 3) projects (20)
INSERT INTO projects (id, created_by, project_name, description, status, starts_at, ends_at, max_participants, created_at, updated_at, is_featured)
VALUES
(1,1,'Portfolio Website','Build personal portfolio site','open','2025-06-01 00:00:00','2025-07-01 00:00:00',3,'2025-05-01 09:00:00','2025-06-01 09:00:00',0),
(2,2,'Brand Identity','Logo and brand guidelines','in_progress','2025-05-10 00:00:00','2025-06-15 00:00:00',4,'2025-04-20 09:00:00','2025-05-11 09:00:00',1),
(3,3,'Data Dashboard','Interactive analytics dashboard','open','2025-07-01 00:00:00','2025-09-01 00:00:00',5,'2025-06-01 09:00:00','2025-06-15 09:00:00',0),
(4,4,'Mobile App MVP','Simple marketplace app','in_progress','2025-05-20 00:00:00','2025-08-01 00:00:00',6,'2025-05-02 09:00:00','2025-06-20 09:00:00',0),
(5,5,'SEO Campaign','Improve organic search','completed','2025-03-01 00:00:00','2025-04-01 00:00:00',2,'2025-02-01 09:00:00','2025-04-02 09:00:00',0),
(6,6,'Product Photos','E-commerce product shoots','completed','2025-02-01 00:00:00','2025-03-01 00:00:00',2,'2025-01-10 09:00:00','2025-03-02 09:00:00',0),
(7,7,'Machine Learning PoC','Proof of concept model','in_progress','2025-06-15 00:00:00','2025-09-15 00:00:00',3,'2025-05-15 09:00:00','2025-06-16 09:00:00',1),
(8,8,'Ad Campaign','Social ads setup','open','2025-07-01 00:00:00','2025-07-31 00:00:00',4,'2025-06-01 09:00:00','2025-06-30 09:00:00',0),
(9,9,'UX Redesign','Improve onboarding UX','in_progress','2025-05-01 00:00:00','2025-06-01 00:00:00',3,'2025-04-01 09:00:00','2025-05-02 09:00:00',0),
(10,10,'Translation Sprint','Translate docs to Spanish','open','2025-07-10 00:00:00','2025-07-25 00:00:00',2,'2025-06-05 09:00:00','2025-06-20 09:00:00',0),
(11,11,'DevOps Setup','CI/CD and infra','in_progress','2025-06-01 00:00:00','2025-06-30 00:00:00',2,'2025-05-10 09:00:00','2025-06-05 09:00:00',1),
(12,12,'Illustration Pack','Icons and illustrations','open','2025-08-01 00:00:00','2025-09-01 00:00:00',3,'2025-07-01 09:00:00','2025-07-15 09:00:00',0),
(13,13,'Security Audit','Pen test and fixes','open','2025-09-01 00:00:00','2025-10-15 00:00:00',1,'2025-08-01 09:00:00','2025-08-15 09:00:00',0),
(14,14,'Product Roadmap','Plan next 6 months','completed','2025-02-10 00:00:00','2025-02-28 00:00:00',3,'2025-01-15 09:00:00','2025-03-01 09:00:00',0),
(15,15,'3D Assets','Create 3D models','in_progress','2025-06-20 00:00:00','2025-08-20 00:00:00',2,'2025-05-20 09:00:00','2025-06-21 09:00:00',0),
(16,16,'Content Series','Weekly tutorial videos','open','2025-07-05 00:00:00','2025-09-05 00:00:00',5,'2025-06-01 09:00:00','2025-06-25 09:00:00',1),
(17,17,'Community Events','Meetups and workshops','open','2025-07-15 00:00:00','2025-10-15 00:00:00',10,'2025-06-10 09:00:00','2025-06-30 09:00:00',0),
(18,18,'E-book','Write and edit e-book','open','2025-09-01 00:00:00','2025-12-01 00:00:00',2,'2025-08-01 09:00:00','2025-08-20 09:00:00',0),
(19,19,'Landing Page','One-page marketing site','completed','2025-04-01 00:00:00','2025-04-10 00:00:00',2,'2025-03-01 09:00:00','2025-04-12 09:00:00',0),
(20,20,'Admin Dashboard','Internal admin tools','in_progress','2025-06-05 00:00:00','2025-08-05 00:00:00',3,'2025-05-05 09:00:00','2025-06-06 09:00:00',1);

-- 4) conversations (20)
INSERT INTO conversations (id, subject, is_group, created_at, updated_at)
VALUES
(1,'Portfolio chat',0,'2025-05-02 10:00:00','2025-05-02 10:00:00'),
(2,'Brand identity discussion',1,'2025-04-21 11:00:00','2025-04-21 11:10:00'),
(3,'Dashboard planning',0,'2025-06-02 09:00:00','2025-06-02 09:05:00'),
(4,'Mobile app team',1,'2025-05-03 12:00:00','2025-05-03 12:30:00'),
(5,'SEO results',0,'2025-04-02 14:00:00','2025-04-02 14:10:00'),
(6,'Product photos logistics',0,'2025-01-11 15:00:00','2025-01-11 15:10:00'),
(7,'ML PoC sync',1,'2025-05-16 10:00:00','2025-05-16 10:20:00'),
(8,'Ad creatives',0,'2025-06-02 09:30:00','2025-06-02 09:35:00'),
(9,'UX discussion',1,'2025-04-03 10:30:00','2025-04-03 10:40:00'),
(10,'Translation volunteers',0,'2025-06-06 11:00:00','2025-06-06 11:05:00'),
(11,'DevOps standup',1,'2025-05-11 08:00:00','2025-05-11 08:15:00'),
(12,'Illustration brief',0,'2025-07-02 09:00:00','2025-07-02 09:10:00'),
(13,'Security ticket',0,'2025-08-02 14:00:00','2025-08-02 14:05:00'),
(14,'Roadmap review',1,'2025-02-20 10:00:00','2025-02-20 10:30:00'),
(15,'3D model requests',0,'2025-06-21 13:00:00','2025-06-21 13:10:00'),
(16,'Video planning',1,'2025-06-05 09:30:00','2025-06-05 09:45:00'),
(17,'Community volunteers',0,'2025-06-11 12:00:00','2025-06-11 12:15:00'),
(18,'Ebook outline',0,'2025-08-05 10:00:00','2025-08-05 10:15:00'),
(19,'Landing page assets',0,'2025-03-02 11:00:00','2025-03-02 11:05:00'),
(20,'Admin feature requests',1,'2025-05-06 09:00:00','2025-05-06 09:10:00');

-- 5) messages (20) -- conversation_id may be null for some; use existing conversation IDs and sender IDs 1..20
INSERT INTO messages (id, conversation_id, sender_id, content, is_read, sent_at)
VALUES
(1,1,1,'Hi! I started the portfolio scaffold.',0,'2025-05-02 10:05:00'),
(2,2,2,'Logo draft uploaded.',0,'2025-04-21 11:05:00'),
(3,3,3,'Dashboard wireframes attached.',1,'2025-06-02 09:10:00'),
(4,4,4,'API endpoints defined.',0,'2025-05-03 12:05:00'),
(5,5,5,'SEO audit results are ready.',1,'2025-04-02 14:05:00'),
(6,6,6,'Photoshoot scheduled for Monday.',0,'2025-01-11 15:05:00'),
(7,7,7,'Training data uploaded.',0,'2025-05-16 10:10:00'),
(8,8,8,'New ad copy looks great.',1,'2025-06-02 09:40:00'),
(9,9,9,'I like the new onboarding flow.',0,'2025-04-03 10:35:00'),
(10,10,10,'I can translate the first chapter.',0,'2025-06-06 11:02:00'),
(11,11,11,'CI pipeline fixed.',1,'2025-05-11 08:10:00'),
(12,12,12,'Illustration style guide attached.',0,'2025-07-02 09:05:00'),
(13,13,13,'Security checklist completed.',0,'2025-08-02 14:03:00'),
(14,14,14,'Roadmap updated with Q2 goals.',1,'2025-02-20 10:10:00'),
(15,15,15,'3D assets uploaded to drive.',0,'2025-06-21 13:05:00'),
(16,16,16,'Shooting schedule for videos.',0,'2025-06-05 09:35:00'),
(17,17,17,'Volunteers confirmed for meetup.',1,'2025-06-11 12:05:00'),
(18,18,18,'Chapter 1 draft attached.',0,'2025-08-05 10:10:00'),
(19,19,19,'Landing page copy finalized.',1,'2025-03-02 11:03:00'),
(20,20,20,'Admin metrics dashboard mockup.',0,'2025-05-06 09:05:00');

-- 6) followers (20)
INSERT INTO followers (id, follower_id, following_id, created_at)
VALUES
(1,2,1,'2025-05-03 09:00:00'),
(2,3,1,'2025-05-04 10:00:00'),
(3,4,2,'2025-05-04 11:00:00'),
(4,5,2,'2025-05-05 12:00:00'),
(5,6,3,'2025-05-06 13:00:00'),
(6,7,3,'2025-05-07 14:00:00'),
(7,8,4,'2025-05-08 15:00:00'),
(8,9,4,'2025-05-09 16:00:00'),
(9,10,5,'2025-05-10 17:00:00'),
(10,11,6,'2025-05-11 18:00:00'),
(11,12,7,'2025-05-12 19:00:00'),
(12,13,8,'2025-05-13 20:00:00'),
(13,14,9,'2025-05-14 09:00:00'),
(14,15,10,'2025-05-15 09:30:00'),
(15,16,11,'2025-05-16 10:30:00'),
(16,17,12,'2025-05-17 11:30:00'),
(17,18,13,'2025-05-18 12:30:00'),
(18,19,14,'2025-05-19 13:30:00'),
(19,20,15,'2025-05-20 14:30:00'),
(20,1,20,'2025-05-21 15:30:00');

-- 7) achievements (20) (user_id references users)
INSERT INTO achievements (id, user_id, title, description, points_reward, icon, earned_at)
VALUES
(1,1,'First Project','Completed first project',50,'award','2025-06-30 10:00:00'),
(2,2,'Top Designer','Delivered 5 designs',100,'star','2025-06-15 11:00:00'),
(3,3,'Data Rookie','Built first dashboard',30,'chart','2025-07-01 09:00:00'),
(4,4,'Mobile Maker','Published MVP',75,'phone','2025-07-20 12:00:00'),
(5,5,'SEO Starter','Improved traffic 10%',40,'rocket','2025-04-02 14:10:00'),
(6,6,'Photographer','Completed photoshoot',20,'camera','2025-03-02 09:00:00'),
(7,7,'ML Contributor','Uploaded dataset',60,'brain','2025-06-16 10:15:00'),
(8,8,'Ad Pro','Launched campaign',45,'megaphone','2025-07-01 09:40:00'),
(9,9,'UX Advocate','Improved onboarding',55,'ux','2025-05-02 10:00:00'),
(10,10,'Translator','Translated 10 pages',35,'translate','2025-07-20 11:00:00'),
(11,11,'DevOps Hero','CI fixed',80,'server','2025-06-05 08:11:00'),
(12,12,'Artist','Delivered illustrations',25,'brush','2025-07-15 09:05:00'),
(13,13,'Security Scout','Ran vulnerability scan',90,'shield','2025-08-02 14:04:00'),
(14,14,'Roadmap Champ','Completed roadmap',15,'map','2025-02-28 10:00:00'),
(15,15,'3D Starter','Uploaded 3D model',30,'3d','2025-06-22 13:05:00'),
(16,16,'Creator','Posted first video',20,'video','2025-06-06 09:32:00'),
(17,17,'Community Builder','Organized meetup',50,'group','2025-06-12 12:05:00'),
(18,18,'Author','Drafted chapter',30,'book','2025-08-06 10:12:00'),
(19,19,'Landing Master','Launched landing',40,'page','2025-04-10 11:05:00'),
(20,20,'Admin Onboard','Configured dashboard',100,'cog','2025-05-06 09:06:00');

-- 8) user_achievements (20) (user_id and achievement_id)
INSERT INTO user_achievements (id, user_id, achievement_id, earned_at)
VALUES
(1,1,1,'2025-06-30 10:00:00'),
(2,2,2,'2025-06-15 11:00:00'),
(3,3,3,'2025-07-01 09:00:00'),
(4,4,4,'2025-07-20 12:00:00'),
(5,5,5,'2025-04-02 14:10:00'),
(6,6,6,'2025-03-02 09:00:00'),
(7,7,7,'2025-06-16 10:15:00'),
(8,8,8,'2025-07-01 09:40:00'),
(9,9,9,'2025-05-02 10:00:00'),
(10,10,10,'2025-07-20 11:00:00'),
(11,11,11,'2025-06-05 08:11:00'),
(12,12,12,'2025-07-15 09:05:00'),
(13,13,13,'2025-08-02 14:04:00'),
(14,14,14,'2025-02-28 10:00:00'),
(15,15,15,'2025-06-22 13:05:00'),
(16,16,16,'2025-06-06 09:32:00'),
(17,17,17,'2025-06-12 12:05:00'),
(18,18,18,'2025-08-06 10:12:00'),
(19,19,19,'2025-04-10 11:05:00'),
(20,20,20,'2025-05-06 09:06:00');

-- 9) notifications (20)
INSERT INTO notifications (id, user_id, notification_type, payload, is_read, created_at)
VALUES
(1,1,'project_invite','{\"project_id\":1}',0,'2025-05-02 09:05:00'),
(2,2,'message','{\"conversation_id\":2,\"message_id\":2}',0,'2025-04-21 11:06:00'),
(3,3,'task_assigned','{\"task_id\":1}',0,'2025-06-03 09:15:00'),
(4,4,'payment','{\"amount\":100}',1,'2025-05-03 12:10:00'),
(5,5,'achievement','{\"achievement_id\":5}',0,'2025-04-02 14:12:00'),
(6,6,'photoshoot','{\"project_id\":6}',0,'2025-01-11 15:06:00'),
(7,7,'data_upload','{\"project_id\":7}',0,'2025-05-16 10:12:00'),
(8,8,'ad_launch','{\"project_id\":8}',1,'2025-06-02 09:42:00'),
(9,9,'ux_change','{\"project_id\":9}',0,'2025-04-03 10:36:00'),
(10,10,'translate_request','{\"project_id\":10}',0,'2025-06-06 11:03:00'),
(11,11,'ci_status','{\"status\":\"passed\"}',1,'2025-05-11 08:12:00'),
(12,12,'design_feedback','{\"project_id\":12}',0,'2025-07-02 09:06:00'),
(13,13,'security_alert','{\"level\":\"low\"}',0,'2025-08-02 14:06:00'),
(14,14,'roadmap_update','{\"project_id\":14}',1,'2025-02-20 10:11:00'),
(15,15,'asset_upload','{\"project_id\":15}',0,'2025-06-21 13:06:00'),
(16,16,'video_schedule','{\"project_id\":16}',0,'2025-06-05 09:36:00'),
(17,17,'event_signup','{\"project_id\":17}',1,'2025-06-11 12:06:00'),
(18,18,'chapter_review','{\"project_id\":18}',0,'2025-08-05 10:11:00'),
(19,19,'launch_complete','{\"project_id\":19}',1,'2025-03-02 11:04:00'),
(20,20,'admin_note','{\"note\":\"please review\"}',0,'2025-05-06 09:07:00');

-- 10) collaborations (20) (requester_id and provider_id reference users; project_id references projects)
INSERT INTO collaborations 
(id, requester_id, provider_id, project_id, title, details, admin_notes, status, requested_at, responded_at, created_at, updated_at, conversation_id) VALUES
(1,1,3,1,'Portfolio help','Need frontend help','', 'accepted','2025-05-02 09:10:00','2025-05-03 10:00:00','2025-05-02 09:10:00','2025-05-03 10:00:00',1),
(2,2,5,2,'Brand designs','Deliver logo and assets','', 'in_progress','2025-04-20 09:30:00','2025-04-22 12:00:00','2025-04-20 09:30:00','2025-04-22 12:00:00',2),
(3,3,11,3,'Dashboard build','Backend & queries','', 'pending','2025-06-01 09:20:00',NULL,'2025-06-01 09:20:00','2025-06-01 09:20:00',3),
(4,4,6,4,'App UI','Design screens','', 'in_progress','2025-05-02 12:10:00','2025-05-05 09:00:00','2025-05-02 12:10:00','2025-05-05 09:00:00',4),
(5,5,8,5,'SEO work','Improve pages','', 'completed','2025-02-05 10:00:00','2025-03-01 09:00:00','2025-02-05 10:00:00','2025-03-01 09:00:00',5),
(6,6,10,6,'Product shoot','Photos and edits','', 'completed','2025-01-05 09:00:00','2025-01-11 15:00:00','2025-01-05 09:00:00','2025-01-11 15:00:00',6),
(7,7,9,7,'ML model','Train baseline model','', 'in_progress','2025-05-15 09:50:00',NULL,'2025-05-15 09:50:00','2025-05-16 10:12:00',7),
(8,8,2,8,'Ad creatives','Design & copy','', 'pending','2025-06-01 09:35:00',NULL,'2025-06-01 09:35:00','2025-06-01 09:35:00',8),
(9,9,5,9,'UX fixes','A/B test flows','', 'in_progress','2025-04-01 09:10:00','2025-04-02 09:00:00','2025-04-01 09:10:00','2025-04-02 09:00:00',9),
(10,10,19,10,'Translate docs','Spanish translation','', 'accepted','2025-06-06 11:05:00','2025-06-07 10:00:00','2025-06-06 11:05:00','2025-06-07 10:00:00',10),
(11,11,12,11,'CI/CD work','Configure pipelines','', 'in_progress','2025-05-10 08:05:00',NULL,'2025-05-10 08:05:00','2025-05-11 08:12:00',11),
(12,12,16,12,'Illustrations','Create icon set','', 'pending','2025-07-01 09:10:00',NULL,'2025-07-01 09:10:00','2025-07-01 09:10:00',12),
(13,13,17,13,'Security fixes','Patch critical issues','', 'pending','2025-08-01 14:10:00',NULL,'2025-08-01 14:10:00','2025-08-01 14:10:00',13),
(14,14,18,14,'Roadmap facilitation','Workshop and deliverables','', 'completed','2025-01-20 10:00:00','2025-02-28 10:00:00','2025-01-20 10:00:00','2025-02-28 10:00:00',14),
(15,15,20,15,'3D models','Low-poly models',NULL,'in_progress','2025-06-20 09:00:00',NULL,'2025-06-20 09:00:00','2025-06-21 13:05:00',15),
-- ✅ FIXED ROW:
(16,16,2,16,'Video production','Film & edit','', 'pending','2025-06-01 09:40:00',NULL,'2025-06-01 09:40:00','2025-06-01 09:40:00',16),
(17,17,7,17,'Meetup organization','Venue & speakers','', 'accepted','2025-06-10 09:00:00','2025-06-11 10:00:00','2025-06-10 09:00:00','2025-06-11 10:00:00',17),
(18,18,13,18,'Ebook editing','Proofread and format','', 'pending','2025-08-01 10:00:00',NULL,'2025-08-01 10:00:00','2025-08-01 10:00:00',18),
(19,19,6,19,'Landing assets','Design & deploy','', 'completed','2025-03-01 09:30:00','2025-03-02 11:00:00','2025-03-01 09:30:00','2025-03-02 11:00:00',19),
(20,20,4,20,'Admin tools','Internal features','', 'in_progress','2025-05-05 09:10:00',NULL,'2025-05-05 09:10:00','2025-05-06 09:06:00',20);

-- 11) tasks (20) (collaboration_id references collaborations, assignee_id references users)
INSERT INTO tasks (id, collaboration_id, title, description, status, priority, assignee_id, due_date, created_at, updated_at)
VALUES
(1,1,'Create landing','Portfolio landing page','todo','High',3,'2025-06-25','2025-05-02 09:30:00','2025-05-02 09:30:00'),
(2,2,'Finalize logo','Polish and export assets','inprogress','Medium',5,'2025-05-30','2025-04-20 09:40:00','2025-04-24 10:00:00'),
(3,3,'Write SQL','Optimize queries','todo','High',11,'2025-07-15','2025-06-01 09:30:00','2025-06-10 09:30:00'),
(4,4,'Design onboarding','Mobile onboarding screens','inprogress','Medium',6,'2025-06-10','2025-05-02 12:30:00','2025-05-10 12:00:00'),
(5,5,'Keyword research','Find target keywords','done','Low',8,'2025-03-01','2025-02-05 10:05:00','2025-03-02 09:00:00'),
(6,6,'Shoot products','2-hour session','done','Medium',10,'2025-01-12','2025-01-05 09:05:00','2025-01-12 09:05:00'),
(7,7,'Prepare dataset','Clean & label','inprogress','High',9,'2025-07-20','2025-05-15 09:55:00','2025-05-20 10:00:00'),
(8,8,'Create ad banners','1200x628 banners','todo','Medium',2,'2025-07-05','2025-06-01 09:40:00','2025-06-01 09:40:00'),
(9,9,'Prototype A','Interactive prototype','inprogress','High',5,'2025-05-15','2025-04-01 09:20:00','2025-04-05 09:00:00'),
(10,10,'Translate chapter 1','Start translating','todo','Low',19,'2025-07-12','2025-06-06 11:06:00','2025-06-10 11:00:00'),
(11,11,'Configure CI','Add tests to pipeline','inprogress','High',11,'2025-06-20','2025-05-10 08:15:00','2025-05-11 08:12:00'),
(12,12,'Icon set v1','Create 50 icons','todo','Medium',16,'2025-08-15','2025-07-01 09:12:00','2025-07-05 09:10:00'),
(13,13,'Patch servers','Apply fixes','todo','High',13,'2025-08-31','2025-08-01 14:12:00','2025-08-02 14:04:00'),
(14,14,'Facilitate workshop','Hold session','done','Medium',18,'2025-02-25','2025-01-20 10:05:00','2025-02-28 10:00:00'),
(15,15,'Low-poly chest','Model low-poly chest','inprogress','Medium',20,'2025-07-30','2025-06-20 09:05:00','2025-06-21 13:05:00'),
(16,16,'Script episodes','Write 4 scripts','todo','Low',16,'2025-07-02','2025-06-01 09:45:00','2025-06-10 09:00:00'),
(17,17,'Book venue','Reserve hall','done','High',7,'2025-06-20','2025-06-10 09:05:00','2025-06-11 10:00:00'),
(18,18,'Edit chapter 2','Edit and proofread','todo','Medium',18,'2025-09-10','2025-08-01 10:05:00','2025-08-05 10:11:00'),
(19,19,'Deploy landing','Push to production','done','High',6,'2025-03-03','2025-03-01 09:35:00','2025-03-02 11:00:00'),
(20,20,'Admin auth','Add role checks','inprogress','High',20,'2025-07-01','2025-05-05 09:12:00','2025-05-06 09:06:00');

-- 12) feedback (20) (from_user_id, to_user_id, project_id)
INSERT INTO feedback (id, from_user_id, to_user_id, project_id, rating, comment, created_at)
VALUES
(1,2,3,1,4.5,'Great frontend work','2025-06-30 11:00:00'),
(2,3,2,2,5.0,'Excellent designs','2025-04-22 12:05:00'),
(3,4,11,3,4.0,'Good SQL optimization','2025-06-10 09:40:00'),
(4,5,6,4,3.5,'Nice UI suggestions','2025-05-05 09:10:00'),
(5,6,8,5,4.0,'SEO improved traffic','2025-03-02 09:15:00'),
(6,7,10,6,4.2,'Good photos','2025-01-12 09:10:00'),
(7,8,9,7,3.8,'Model baseline achieved','2025-05-20 10:05:00'),
(8,9,2,8,4.1,'Ad creatives worked','2025-06-02 09:50:00'),
(9,10,5,9,4.6,'UX improvements were helpful','2025-04-05 09:05:00'),
(10,11,19,10,4.0,'Translations accurate','2025-06-10 11:05:00'),
(11,12,11,11,5.0,'CI setup was solid','2025-05-11 08:16:00'),
(12,13,16,12,4.0,'Icons are consistent','2025-07-05 09:15:00'),
(13,14,13,13,3.9,'Security findings useful','2025-08-02 14:07:00'),
(14,15,18,14,4.2,'Roadmap was clear','2025-02-28 10:05:00'),
(15,16,20,15,4.3,'3D models look good','2025-06-22 13:10:00'),
(16,17,16,16,3.7,'Videos need pacing','2025-06-10 09:05:00'),
(17,18,7,17,4.8,'Great meetup organization','2025-06-12 12:08:00'),
(18,19,13,18,4.0,'Editing improved flow','2025-08-06 10:15:00'),
(19,20,6,19,4.5,'Landing was fast and responsive','2025-03-03 11:10:00'),
(20,1,4,20,4.7,'Admin UI improvements','2025-05-06 09:10:00');

-- 13) reports (20) (reporter_id and reported_user_id reference users)
INSERT INTO reports (id, reporter_id, reported_user_id, issue, status, priority, created_at, resolved_at)
VALUES
(1,2,5,'Spam','pending','Low','2025-06-01 10:00:00',NULL),
(2,3,4,'Inappropriate message','resolved','High','2025-06-02 11:00:00','2025-06-03 09:00:00'),
(3,4,2,'Plagiarism','investigating','Medium','2025-05-05 12:00:00',NULL),
(4,5,9,'Harassment','pending','High','2025-04-10 09:00:00',NULL),
(5,6,7,'Fake profile','resolved','Medium','2025-03-01 08:00:00','2025-03-05 10:00:00'),
(6,7,8,'Copyright','investigating','Low','2025-05-16 10:00:00',NULL),
(7,8,11,'Abuse','pending','High','2025-06-02 09:00:00',NULL),
(8,9,3,'Spam messages','resolved','Low','2025-04-03 10:20:00','2025-04-05 09:00:00'),
(9,10,12,'Impersonation','investigating','High','2025-06-06 11:10:00',NULL),
(10,11,14,'Offensive content','pending','Medium','2025-05-11 08:20:00',NULL),
(11,12,13,'Security issue','investigating','High','2025-07-01 09:20:00',NULL),
(12,13,15,'Policy violation','resolved','Low','2025-06-20 10:00:00','2025-06-22 09:00:00'),
(13,14,16,'Spam','pending','Low','2025-02-21 10:00:00',NULL),
(14,15,17,'Harassment','resolved','High','2025-06-22 13:15:00','2025-06-23 09:00:00'),
(15,16,18,'False claims','pending','Medium','2025-06-12 09:00:00',NULL),
(16,17,19,'Inappropriate images','investigating','High','2025-06-13 11:00:00',NULL),
(17,18,20,'Abuse of admin privileges','pending','High','2025-08-01 09:00:00',NULL),
(18,19,1,'Spam account','resolved','Low','2025-03-02 10:00:00','2025-03-04 09:00:00'),
(19,20,2,'Fake endorsement','investigating','Medium','2025-05-06 09:15:00',NULL),
(20,1,10,'Off-topic messages','dismissed','Low','2025-05-03 09:45:00',NULL);

-- 14) project_participants (20) (project_id, user_id)
INSERT INTO project_participants (project_id, user_id, role, joined_at, left_at)
VALUES
(1,1,'member','2025-05-01 10:00:00',NULL),
(1,3,'member','2025-05-02 11:00:00',NULL),
(2,2,'owner','2025-04-20 09:40:00',NULL),
(2,5,'designer','2025-04-21 10:00:00',NULL),
(3,3,'owner','2025-06-01 09:20:00',NULL),
(3,11,'developer','2025-06-03 09:00:00',NULL),
(4,4,'owner','2025-05-02 12:10:00',NULL),
(4,6,'designer','2025-05-03 09:00:00',NULL),
(5,5,'owner','2025-02-05 10:00:00',NULL),
(6,6,'owner','2025-01-05 09:00:00',NULL),
(7,7,'owner','2025-05-15 09:50:00',NULL),
(7,9,'data','2025-05-16 10:10:00',NULL),
(8,8,'owner','2025-06-01 09:35:00',NULL),
(9,9,'owner','2025-04-01 09:10:00',NULL),
(10,10,'owner','2025-06-06 11:05:00',NULL),
(11,11,'owner','2025-05-10 08:05:00',NULL),
(12,12,'owner','2025-07-01 09:10:00',NULL),
(13,13,'owner','2025-08-01 14:10:00',NULL),
(14,14,'owner','2025-01-20 10:00:00',NULL),
(15,15,'owner','2025-06-20 09:00:00',NULL);

-- 15) skill_endorsements (20)
INSERT INTO skill_endorsements (id, user_id, endorsed_by, skill_id, created_at)
VALUES
(1,1,2,1,'2025-06-30 11:10:00'),
(2,2,3,2,'2025-04-22 12:10:00'),
(3,3,4,3,'2025-07-01 09:05:00'),
(4,4,5,6,'2025-05-05 09:20:00'),
(5,5,6,4,'2025-03-02 09:20:00'),
(6,6,7,10,'2025-01-12 09:20:00'),
(7,7,8,9,'2025-05-20 10:10:00'),
(8,8,9,8,'2025-06-02 09:55:00'),
(9,9,10,5,'2025-04-05 09:10:00'),
(10,10,11,19,'2025-06-10 11:10:00'),
(11,11,12,12,'2025-05-11 08:20:00'),
(12,12,13,16,'2025-07-05 09:20:00'),
(13,13,14,13,'2025-08-02 14:10:00'),
(14,14,15,18,'2025-02-28 10:10:00'),
(15,15,16,20,'2025-06-22 13:20:00'),
(16,16,17,11,'2025-06-06 09:40:00'),
(17,17,7,7,'2025-06-12 12:10:00'),
(18,18,13,19,'2025-08-06 10:20:00'),
(19,19,6,2,'2025-03-03 11:12:00'),
(20,20,4,15,'2025-05-06 09:20:00');

-- 16) skill_verifications (20) (skill_id references skills, requester_id and verifier_id reference users)
INSERT INTO skill_verifications (id, skill_id, requester_id, verifier_id, status, notes, created_at, updated_at)
VALUES
(1,1,1,3,'approved','Verified via project','2025-06-30 11:15:00','2025-07-01 09:00:00'),
(2,2,2,5,'approved','Reviewed portfolio','2025-04-22 12:15:00','2025-04-23 09:00:00'),
(3,3,3,11,'requested','Requesting verification','2025-06-02 09:20:00','2025-06-05 09:00:00'),
(4,4,4,8,'rejected','Insufficient evidence','2025-05-02 12:20:00','2025-05-10 09:05:00'),
(5,5,5,9,'approved','Test passed','2025-02-05 10:20:00','2025-03-02 09:05:00'),
(6,6,6,10,'approved','Photoshoot evidence','2025-01-05 09:10:00','2025-01-12 09:10:00'),
(7,7,7,9,'requested','Need more info','2025-05-15 09:55:00','2025-05-20 10:05:00'),
(8,8,8,2,'approved','Creative review','2025-06-01 09:45:00','2025-06-02 09:45:00'),
(9,9,9,5,'approved','UX tasks completed','2025-04-01 09:30:00','2025-04-05 09:05:00'),
(10,10,10,19,'approved','Translation samples good','2025-06-06 11:06:00','2025-06-07 10:10:00'),
(11,11,11,12,'approved','Pipeline shows green','2025-05-10 08:20:00','2025-05-11 08:13:00'),
(12,12,12,16,'requested','Please submit assets','2025-07-01 09:15:00','2025-07-05 09:12:00'),
(13,13,13,17,'requested','Need scan results','2025-08-01 14:15:00','2025-08-02 14:05:00'),
(14,14,14,18,'approved','Great facilitation','2025-01-20 10:10:00','2025-02-28 10:05:00'),
(15,15,15,20,'approved','3D files validated','2025-06-20 09:05:00','2025-06-22 13:10:00'),
(16,16,16,2,'approved','Style consistent','2025-06-01 09:50:00','2025-06-05 09:20:00'),
(17,17,17,7,'requested','Please provide logs','2025-06-10 09:05:00','2025-06-11 10:05:00'),
(18,18,18,13,'approved','Edits accepted','2025-08-01 10:05:00','2025-08-05 10:12:00'),
(19,19,19,6,'approved','Landing copy accurate','2025-03-01 09:40:00','2025-03-02 11:05:00'),
(20,20,20,4,'requested','Admin confirms access','2025-05-05 09:15:00','2025-05-06 09:08:00');

-- 17) user_skills (20) (user_id & skill_id composite PK)
INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience, verified_by, verified_at, created_at, updated_at)
VALUES
(1,1,'advanced',3,3,'2025-07-01 09:00:00','2025-05-01 09:30:00','2025-06-01 09:00:00'),
(2,2,'intermediate',2,5,'2025-04-23 09:00:00','2025-04-20 09:45:00','2025-05-01 09:00:00'),
(3,3,'advanced',4,11,'2025-06-05 09:00:00','2025-06-01 09:25:00','2025-06-15 09:00:00'),
(4,6,'intermediate',2,6,'2025-05-10 09:00:00','2025-05-02 12:20:00','2025-05-10 09:00:00'),
(5,4,'beginner',1,8,'2025-03-02 09:05:00','2025-02-05 10:05:00','2025-03-02 09:00:00'),
(6,10,'intermediate',2,10,'2025-01-12 09:10:00','2025-01-05 09:10:00','2025-01-12 09:10:00'),
(7,9,'beginner',1,9,'2025-05-20 10:05:00','2025-05-15 09:50:00','2025-05-16 10:12:00'),
(8,8,'advanced',3,2,'2025-06-02 09:45:00','2025-06-01 09:35:00','2025-06-02 09:45:00'),
(9,5,'advanced',4,5,'2025-04-05 09:05:00','2025-04-01 09:00:00','2025-04-05 09:05:00'),
(10,19,'intermediate',2,19,'2025-06-07 10:10:00','2025-06-06 11:06:00','2025-06-07 10:10:00'),
(11,12,'advanced',3,11,'2025-05-11 08:13:00','2025-05-10 08:20:00','2025-05-11 08:13:00'),
(12,16,'intermediate',2,16,'2025-07-05 09:12:00','2025-07-01 09:10:00','2025-07-05 09:12:00'),
(13,13,'advanced',5,17,'2025-08-02 14:05:00','2025-08-01 14:10:00','2025-08-02 14:05:00'),
(14,18,'beginner',1,18,'2025-02-28 10:05:00','2025-01-20 10:10:00','2025-02-28 10:05:00'),
(15,20,'intermediate',2,20,'2025-06-22 13:10:00','2025-06-20 09:05:00','2025-06-22 13:10:00'),
(16,11,'beginner',1,11,'2025-06-06 09:40:00','2025-06-01 09:50:00','2025-06-06 09:40:00'),
(17,7,'intermediate',2,9,'2025-06-12 12:10:00','2025-06-10 09:05:00','2025-06-12 12:10:00'),
(18,19,'beginner',1,13,'2025-08-06 10:12:00','2025-08-01 10:05:00','2025-08-06 10:12:00'),
(19,2,'advanced',4,6,'2025-03-03 11:12:00','2025-03-01 09:40:00','2025-03-03 11:12:00'),
(20,15,'advanced',5,4,'2025-05-06 09:08:00','2025-05-05 09:15:00','2025-05-06 09:08:00');

-- 18) admins (use existing user ids as id PK and FK to users.id)
INSERT INTO admins (id, admin_role, permissions, created_at, updated_at)
VALUES
(20,'superadmin','{\"manage_users\":true,\"manage_content\":true}','2025-05-06 09:10:00','2025-05-06 09:10:00');

-- 19) students (user id is PK)
INSERT INTO students (id, student_number, college, points_balance, rating, rating_count, created_at, updated_at)
VALUES
(1,'STU001','ABC College',120,4.5,10,'2025-05-01 09:30:00','2025-06-01 09:00:00');

-- To ensure 20 rows for students table as requested, but schema requires id = users.id as PK.
-- We'll create 20 student rows by reusing 20 existing users as student records where allowed.
INSERT INTO students (id, student_number, college, points_balance, rating, rating_count, created_at, updated_at)
VALUES
(2,'STU002','XYZ University',80,4.0,5,'2025-04-20 09:40:00','2025-05-01 09:00:00'),
(3,'STU003','LMN Institute',50,4.2,3,'2025-06-01 09:25:00','2025-06-15 09:00:00'),
(5,'STU005','Design School',40,3.8,2,'2025-02-05 10:05:00','2025-03-02 09:00:00'),
(6,'STU006','Photo Academy',60,4.1,4,'2025-01-05 09:10:00','2025-01-12 09:10:00'),
(7,'STU007','Data College',30,3.9,1,'2025-05-15 09:55:00','2025-05-20 10:05:00'),
(9,'STU009','UX University',70,4.6,6,'2025-04-01 09:10:00','2025-04-05 09:05:00'),
(10,'STU010','Lang Institute',20,4.0,2,'2025-06-06 11:06:00','2025-06-10 11:00:00'),
(11,'STU011','DevOps Bootcamp',90,5.0,8,'2025-05-10 08:15:00','2025-05-11 08:12:00'),
(12,'STU012','Art School',25,3.7,1,'2025-07-01 09:12:00','2025-07-05 09:12:00'),
(13,'STU013','Security College',10,4.0,1,'2025-08-01 14:10:00','2025-08-02 14:05:00'),
(14,'STU014','Biz School',15,4.2,2,'2025-01-20 10:05:00','2025-02-28 10:05:00'),
(15,'STU015','3D Academy',35,4.3,3,'2025-06-20 09:05:00','2025-06-22 13:10:00'),
(16,'STU016','Video Institute',5,3.7,1,'2025-06-01 09:45:00','2025-06-10 09:00:00'),
(17,'STU017','Community College',12,4.1,2,'2025-06-10 09:05:00','2025-06-11 10:00:00'),
(18,'STU018','Publishing School',18,4.0,2,'2025-08-01 10:05:00','2025-08-05 10:11:00'),
(19,'STU019','Marketing Institute',25,4.5,4,'2025-03-01 09:40:00','2025-03-02 11:05:00'),
(4,'STU004','Engineering College',55,4.1,3,'2025-05-02 12:20:00','2025-05-10 09:05:00'),
(8,'STU008','Business School',28,3.9,2,'2025-06-01 09:35:00','2025-06-02 09:45:00'),
(20,'STU020','Admin Academy',100,4.8,12,'2025-05-05 09:15:00','2025-05-06 09:08:00');

-- 20) transactions (20)
INSERT INTO transactions (id, from_user_id, to_user_id, transaction_type, amount, balance_after, description, created_at)
VALUES
(1, NULL,1,'earn',100,100,'Initial points', '2025-05-01 09:40:00'),
(2,1,2,'transfer',20,80,'Tip for help','2025-05-03 09:40:00'),
(3,3,NULL,'earn',50,50,'Completed task','2025-06-02 09:25:00'),
(4,4,1,'transfer',10,110,'Reimbursement','2025-05-03 12:15:00'),
(5,5,NULL,'earn',40,40,'SEO bonus','2025-03-02 09:18:00'),
(6,6,10,'transfer',15,45,'Photo fee','2025-01-12 09:15:00'),
(7,7,9,'transfer',30,30,'ML data sale','2025-05-16 10:18:00'),
(8,8,2,'transfer',12,33,'Ad design fee','2025-06-02 09:48:00'),
(9,9,5,'transfer',25,45,'UX consultancy','2025-04-05 09:12:00'),
(10,10,19,'transfer',18,32,'Translation fee','2025-06-07 10:12:00'),
(11,11,NULL,'earn',80,80,'CI setup reward','2025-05-11 08:18:00'),
(12,12,NULL,'earn',25,25,'Icon set reward','2025-07-05 09:25:00'),
(13,13,NULL,'earn',90,90,'Security bounty','2025-08-02 14:12:00'),
(14,14,NULL,'earn',15,15,'Roadmap bonus','2025-02-28 10:08:00'),
(15,15,NULL,'earn',30,30,'3D contribution','2025-06-22 13:15:00'),
(16,16,NULL,'earn',20,20,'Video upload','2025-06-06 09:42:00'),
(17,17,NULL,'earn',50,50,'Meetup stipend','2025-06-12 12:10:00'),
(18,18,NULL,'earn',30,30,'Chapter edit','2025-08-06 10:18:00'),
(19,19,NULL,'earn',40,40,'Landing launch','2025-03-03 11:12:00'),
(20,20,NULL,'admin_adjustment',200,200,'Admin credit','2025-05-06 09:12:00');

-- 21) timeline_events (20)
INSERT INTO timeline_events (id, user_id, event_type, title, description, icon, created_at)
VALUES
(1,1,'project','Portfolio published','Launched portfolio website','⭐','2025-07-01 10:00:00'),
(2,2,'achievement','Top Designer','Reached 5 designs','🏆','2025-06-15 11:15:00'),
(3,3,'project','Dashboard released','First dashboard milestone','📊','2025-07-02 09:10:00'),
(4,4,'project','App MVP','Deployed mobile MVP','📱','2025-07-21 12:05:00'),
(5,5,'achievement','SEO gains','Traffic improved','🚀','2025-04-02 14:15:00'),
(6,6,'project','Photoshoot done','Product photography complete','📷','2025-01-12 09:20:00'),
(7,7,'activity','Data uploaded','Dataset added to project','🧠','2025-05-16 10:20:00'),
(8,8,'project','Ads live','Ad campaign launched','📢','2025-06-02 09:50:00'),
(9,9,'achievement','UX wins','Onboarding improvements','✨','2025-05-02 10:05:00'),
(10,10,'activity','Translation done','Chapter 1 translated','🌐','2025-06-07 10:12:00'),
(11,11,'achievement','CI fixed','Pipeline green','⚙️','2025-05-11 08:18:00'),
(12,12,'project','Icons ready','Icon pack v1','🎨','2025-07-05 09:20:00'),
(13,13,'activity','Security scan','Findings documented','🔒','2025-08-02 14:10:00'),
(14,14,'achievement','Roadmap finished','6-month plan complete','🗺️','2025-02-28 10:10:00'),
(15,15,'project','3D upload','3D assets uploaded','🧩','2025-06-22 13:12:00'),
(16,16,'activity','Video shoot','First episode filmed','🎬','2025-06-05 09:40:00'),
(17,17,'event','Meetup organized','Community meetup held','👥','2025-06-12 12:10:00'),
(18,18,'project','Ebook draft','Chapter 1 draft complete','📚','2025-08-06 10:15:00'),
(19,19,'project','Landing live','Published landing page','🌐','2025-03-03 11:10:00'),
(20,20,'admin','Admin setup','Configured admin dashboard','🔧','2025-05-06 09:13:00');

-- 22) announcements (20)
INSERT INTO announcements (id, admin_id, title, message, created_at) VALUES
(1,20,'Maintenance','Scheduled maintenance on 2025-12-10','2025-11-20 09:00:00'),
(2,20,'New Feature','Project analytics live','2025-11-01 10:00:00'),
(3,20,'Policy Update','Updated community guidelines','2025-10-01 08:00:00'),
(4,20,'Meetup','Community meetup announced','2025-09-01 09:00:00'),
(5,20,'Security','Password policy updated','2025-08-01 09:30:00'),
(6,20,'Beta','New beta testers needed','2025-07-01 11:00:00'),
(7,20,'Ebook','Ebook release soon','2025-06-01 10:00:00'),
(8,20,'Campaign','Summer campaign starts','2025-05-01 09:00:00'),
(9,20,'Icons','New icons released','2025-04-01 09:00:00'),
(10,20,'Jobs','Looking for contributors','2025-03-01 09:00:00'),
(11,20,'Photoshoot','Book your slot','2025-02-01 09:00:00'),
(12,20,'Translation','Volunteer translators needed','2025-01-15 09:00:00'),
(13,20,'DevOps','Maintenance windows announced','2024-12-10 09:00:00'),
(14,20,'UX','New onboarding tests','2024-11-01 10:00:00'),
(15,20,'3D','3D asset competition','2024-10-05 11:00:00'),
(16,20,'Video','Guidelines for creators','2024-09-01 09:00:00'),
(17,20,'Security2','Two-factor auth recommended','2024-08-01 09:00:00'),
(18,20,'Community','Volunteer appreciation','2024-07-01 09:00:00'),
(19,20,'Analytics','New dashboard metrics','2024-06-01 09:00:00'),
(20,20,'Admin Notice','Please review reports','2024-05:01 09:00:00');

-- 23) activity (20)
INSERT INTO activity (id, user_id, type, meta, created_at)
VALUES
(1,1,'project_created','{\"project_id\":1}','2025-05-01 09:05:00'),
(2,2,'collaboration_requested','{\"collab_id\":2}','2025-04-20 09:35:00'),
(3,3,'skill_verified','{\"skill_id\":3}','2025-06-05 09:05:00'),
(4,4,'task_completed','{\"task_id\":4}','2025-05-10 09:15:00'),
(5,5,'seo_report','{\"traffic\":10}','2025-03-02 09:20:00'),
(6,6,'photo_uploaded','{\"project_id\":6}','2025-01-12 09:18:00'),
(7,7,'dataset_uploaded','{\"project_id\":7}','2025-05-16 10:12:00'),
(8,8,'ad_launched','{\"project_id\":8}','2025-06-02 09:45:00'),
(9,9,'ux_test','{\"project_id\":9}','2025-04-05 09:08:00'),
(10,10,'translation_done','{\"project_id\":10}','2025-06-07 10:13:00'),
(11,11,'ci_build','{\"status\":\"passed\"}','2025-05-11 08:13:00'),
(12,12,'icons_uploaded','{\"project_id\":12}','2025-07-05 09:22:00'),
(13,13,'scan_completed','{\"issues\":0}','2025-08-02 14:08:00'),
(14,14,'roadmap_published','{\"quarter\":\"Q2\"}','2025-02-28 10:08:00'),
(15,15,'3d_uploaded','{\"project_id\":15}','2025-06-22 13:12:00'),
(16,16,'video_uploaded','{\"episode\":1}','2025-06-06 09:35:00'),
(17,17,'event_created','{\"event_id\":17}','2025-06-11 12:08:00'),
(18,18,'chapter_drafted','{\"chapter\":1}','2025-08-06 10:14:00'),
(19,19,'landing_published','{\"project_id\":19}','2025-03-03 11:11:00'),
(20,20,'admin_config','{\"setting\":\"roles\"}','2025-05-06 09:14:00');

-- 24) certificates (20)
INSERT INTO certificates (id, user_id, title, issuer, issued_at, expires_at, image_url, verification_url)
VALUES
(1,1,'Web Cert','Online University','2025-06-01','2027-06-01',NULL,NULL),
(2,2,'Design Cert','Design Institute','2025-04-15','2027-04-15',NULL,NULL),
(3,3,'Data Cert','Data Academy','2025-07-01','2027-07-01',NULL,NULL),
(4,4,'Mobile Cert','App School','2025-07-20','2027-07-20',NULL,NULL),
(5,5,'SEO Cert','Marketing Org','2025-03-02','2027-03-02',NULL,NULL),
(6,6,'Photo Cert','Photo Club','2025-01-12','2027-01-12',NULL,NULL),
(7,7,'ML Cert','ML Institute','2025-05-20','2027-05-20',NULL,NULL),
(8,8,'Ads Cert','Ad Agency','2025-06-02','2027-06-02',NULL,NULL),
(9,9,'UX Cert','UX School','2025-04-05','2027-04-05',NULL,NULL),
(10,10,'Lang Cert','Lang Academy','2025-06-07','2027-06-07',NULL,NULL),
(11,11,'DevOps Cert','Ops School','2025-05-11','2027-05-11',NULL,NULL),
(12,12,'Illustration Cert','Art School','2025-07-05','2027-07-05',NULL,NULL),
(13,13,'Security Cert','Security Lab','2025-08-02','2027-08-02',NULL,NULL),
(14,14,'PM Cert','Business School','2025-02-28','2027-02-28',NULL,NULL),
(15,15,'3D Cert','3D Institute','2025-06-22','2027-06-22',NULL,NULL),
(16,16,'Video Cert','Film School','2025-06-06','2027-06-06',NULL,NULL),
(17,17,'Community Cert','Community Org','2025-06-12','2027-06-12',NULL,NULL),
(18,18,'Editing Cert','Publishing House','2025-08-06','2027-08-06',NULL,NULL),
(19,19,'Marketing Cert','Market Org','2025-03-03','2027-03-03',NULL,NULL),
(20,20,'Admin Cert','Platform','2025-05-06','2027-05-06',NULL,NULL);

SET FOREIGN_KEY_CHECKS = 1;

-- Seed complete


UPDATE announcements
SET created_at = '2024-05-01 09:00:00'
WHERE id = 20;
