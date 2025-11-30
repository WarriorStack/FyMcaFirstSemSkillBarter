USE skill_Barter;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE feedback;
TRUNCATE TABLE notifications;
TRUNCATE TABLE messages;
TRUNCATE TABLE conversations;
TRUNCATE TABLE transactions;
TRUNCATE TABLE collaborations;
TRUNCATE TABLE project_participants;
TRUNCATE TABLE projects;
TRUNCATE TABLE skill_verifications;
TRUNCATE TABLE user_skills;
TRUNCATE TABLE skills;
TRUNCATE TABLE admins;
TRUNCATE TABLE students;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-------------------------------------------------------------
-- USERS (15 sample users: 10 students + 3 admins)
-- userpassword is 123456 for everyone 
-- adminpassword is admin123 for everyone
-------------------------------------------------------------
INSERT INTO users (email, password, full_name, display_name, phone, user_type, is_active, avatar_url)
VALUES
('john@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','John Doe','JohnD','111-1111','student',1,NULL),
('sara@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Sara Park','SaraP','222-2222','student',1,NULL),
('mike@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Mike Chan','MikeC','333-3333','student',1,NULL),
('linda@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Linda Cruz','LindaC','444-4444','student',1,NULL),
('adam@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Adam Smith','AdamS','555-5555','student',1,NULL),
('zoe@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Zoe Kim','ZoeK','666-6666','student',1,NULL),
('karl@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Karl Jones','KarlJ','777-7777','student',1,NULL),
('rachel@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Rachel Lim','RachL','888-8888','student',1,NULL),
('tony@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Tony Blake','TonyB','999-9999','student',1,NULL),
('ivy@example.com','$2a$10$Xtf2nK2a1mQY7N5A2w7w4eE6G7pN3ppsyvhofP6Cv7PjLL7Yq6C9G','Ivy Long','IvyL','000-0000','student',1,NULL),

-- ADMIN USERS (3 admins)
('admin1@example.com','$2a$10$4YLAeGZ0o9b7T2bNQFzLx.nGiCl9R4aobQtd9F2sZ.6GBwn5kBy1G','Alice Admin','AdminA','123-1111','admin',1,NULL),
('admin2@example.com','$2a$10$4YLAeGZ0o9b7T2bNQFzLx.nGiCl9R4aobQtd9F2sZ.6GBwn5kBy1G','Bob Admin','AdminB','123-2222','admin',1,NULL),
('admin3@example.com','$2a$10$4YLAeGZ0o9b7T2bNQFzLx.nGiCl9R4aobQtd9F2sZ.6GBwn5kBy1G','Charlie Admin','AdminC','123-3333','admin',1,NULL);

-------------------------------------------------------------
-- STUDENTS (match user IDs 1–10)
-------------------------------------------------------------
INSERT INTO students (id, student_number, college, points_balance, rating, rating_count)
VALUES
(1,'STU1001','Engineering',150,4.5,10),
(2,'STU1002','Business',120,4.2,8),
(3,'STU1003','Arts',80,4.0,5),
(4,'STU1004','Engineering',200,4.8,15),
(5,'STU1005','IT',90,3.9,4),
(6,'STU1006','Business',130,4.1,7),
(7,'STU1007','IT',70,3.8,3),
(8,'STU1008','Arts',160,4.6,11),
(9,'STU1009','Engineering',110,4.3,6),
(10,'STU1010','Business',95,4.0,4);

-------------------------------------------------------------
-- ADMINS (IDs 11–13)
-------------------------------------------------------------
INSERT INTO admins (id, admin_role, permissions)
VALUES
(11,'super_admin','{"manage_users":true,"manage_projects":true}'),
(12,'moderator','{"verify_skills":true}'),
(13,'moderator','{"review_reports":true}');

-------------------------------------------------------------
-- SKILLS (10 skills)
-------------------------------------------------------------
INSERT INTO skills (skill_name, category, description, verified)
VALUES
('Web Development','Technology','Frontend + backend skills',1),
('Graphic Design','Design','Branding and digital graphics',1),
('Photography','Media','Camera and editing skills',0),
('Video Editing','Media','Adobe Premiere, DaVinci',0),
('Public Speaking','Communication','Presentation skills',1),
('Tutoring - Math','Education','Algebra, calculus',1),
('Tutoring - English','Education','Reading & writing support',0),
('Mobile App Development','Technology','Android + iOS basics',1),
('UI/UX Design','Design','User experience principles',1),
('Data Analysis','Technology','Excel, SQL, Python',1);

-------------------------------------------------------------
-- USER_SKILLS (10 rows)
-------------------------------------------------------------
INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience)
VALUES
(1,1,'advanced',3),
(2,2,'intermediate',2),
(3,3,'beginner',1),
(4,4,'expert',5),
(5,5,'intermediate',2),
(6,6,'advanced',4),
(7,7,'beginner',1),
(8,8,'intermediate',2),
(9,9,'advanced',3),
(10,10,'advanced',3);

-------------------------------------------------------------
-- SKILL_VERIFICATIONS
-------------------------------------------------------------
INSERT INTO skill_verifications (skill_id, requester_id, verifier_id, status, notes)
VALUES
(1,1,11,'approved','Verified by admin'),
(2,2,12,'approved','Looks good'),
(3,3,NULL,'requested','Awaiting verification'),
(4,4,11,'approved','Strong skill'),
(5,5,NULL,'requested','Pending'),
(6,6,11,'approved','OK'),
(7,7,NULL,'requested','Pending'),
(8,8,12,'approved','Verified'),
(9,9,11,'approved','Excellent'),
(10,10,NULL,'requested','Awaiting review');

-------------------------------------------------------------
-- PROJECTS (IDs auto 1–10)
-------------------------------------------------------------
INSERT INTO projects (created_by, project_name, description, status, starts_at, ends_at, max_participants)
VALUES
(1,'Campus Website Revamp','Update UI','open',NULL,NULL,10),
(2,'Photography Event','Shoot for campus','in_progress',NULL,NULL,5),
(3,'Math Tutoring Week','Help freshmen','open',NULL,NULL,20),
(4,'Video Production','Short film','completed',NULL,NULL,8),
(5,'Debate Training','Public speaking practice','open',NULL,NULL,12),
(6,'Design Hackathon','UI challenge','open',NULL,NULL,15),
(7,'Mobile App Sprint','Prototype app','in_progress',NULL,NULL,6),
(8,'Art Portfolio Review','Critique session','open',NULL,NULL,10),
(9,'SQL Workshop','Teach fundamentals','completed',NULL,NULL,30),
(10,'Coding Bootcamp','Beginner-friendly','open',NULL,NULL,25);

-------------------------------------------------------------
-- PROJECT PARTICIPANTS
-------------------------------------------------------------
INSERT INTO project_participants (project_id, user_id, role)
VALUES
(1,1,'owner'),
(1,2,'member'),
(2,3,'member'),
(3,4,'owner'),
(4,5,'member'),
(5,6,'owner'),
(6,7,'member'),
(7,8,'member'),
(8,9,'owner'),
(9,10,'member');

-------------------------------------------------------------
-- COLLABORATIONS
-------------------------------------------------------------
INSERT INTO collaborations (requester_id, provider_id, project_id, title, details, status)
VALUES
(1,2,1,'Web Help','Need CSS assistance','pending'),
(2,3,2,'Photo Help','Lighting support','accepted'),
(3,4,3,'Tutoring','Math help','completed'),
(4,5,4,'Editing','Need Adobe help','in_progress'),
(5,6,5,'Speech Practice','Mentoring','pending'),
(6,7,6,'Design Review','Feedback needed','accepted'),
(7,8,7,'App Ideas','Feature discussion','pending'),
(8,9,8,'Art Critique','Style improvement','rejected'),
(9,10,9,'SQL Help','Database basics','completed'),
(10,1,10,'Bootcamp','Assist beginners','accepted');

-------------------------------------------------------------
-- TRANSACTIONS
-------------------------------------------------------------
INSERT INTO transactions (from_user_id, to_user_id, transaction_type, amount, balance_after, description)
VALUES
(NULL,1,'earn',20,170,'Completed project'),
(1,2,'transfer',10,130,'Skill exchange'),
(2,3,'transfer',5,85,'Tutoring'),
(NULL,4,'earn',30,230,'System award'),
(5,NULL,'redeem',20,NULL,'Redeemed gift'),
(6,7,'transfer',15,85,'Project help'),
(8,9,'transfer',25,135,'Design work'),
(NULL,10,'earn',10,105,'Activity bonus'),
(3,1,'transfer',5,175,'Exchange'),
(4,6,'transfer',10,140,'Collaboration');

-------------------------------------------------------------
-- CONVERSATIONS
-------------------------------------------------------------
INSERT INTO conversations (subject, is_group)
VALUES
('Project Web Update',0),
('Event Planning',1),
('Tutoring Group',1),
('Film Editing Chat',0),
('Debate Prep',0),
('Design Talk',1),
('App Team Chat',1),
('Portfolio Feedback',0),
('SQL Workshop',1),
('Bootcamp Questions',0);

-------------------------------------------------------------
-- MESSAGES
-------------------------------------------------------------
INSERT INTO messages (conversation_id, sender_id, content)
VALUES
(1,1,'Hey, need help with UI'),
(1,2,'Sure, I can assist'),
(2,3,'Meeting tomorrow?'),
(3,4,'Let’s schedule sessions'),
(4,5,'Editing almost done'),
(5,6,'Practice tonight'),
(6,7,'Check new mockups'),
(7,8,'Updated API'),
(8,9,'Review my sketches'),
(9,10,'Workshop slides ready');

-------------------------------------------------------------
-- NOTIFICATIONS
-------------------------------------------------------------
INSERT INTO notifications (user_id, notification_type, payload)
VALUES
(1,'project_update','{"project":1}'),
(2,'collaboration_request','{"from":1}'),
(3,'message','{"conversation":2}'),
(4,'rating_received','{"from":5}'),
(5,'project_invite','{"project":4}'),
(6,'transaction','{"amount":15}'),
(7,'skill_verification','{"skill":7}'),
(8,'feedback','{"project":8}'),
(9,'message','{"conversation":9}'),
(10,'project_update','{"project":10}');

-------------------------------------------------------------
-- FEEDBACK
-------------------------------------------------------------
INSERT INTO feedback (from_user_id, to_user_id, project_id, rating, comment)
VALUES
(1,2,1,4.5,'Great teamwork'),
(2,3,2,4.0,'Good effort'),
(3,4,3,5.0,'Excellent tutor'),
(4,5,4,4.8,'Nice editing'),
(5,6,5,4.2,'Helpful guidance'),
(6,7,6,4.1,'Clear explanations'),
(7,8,7,3.9,'Decent collaboration'),
(8,9,8,4.7,'Amazing critique'),
(9,10,9,4.6,'Very informative'),
(10,1,10,4.3,'Great mentor');
